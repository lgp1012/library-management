package me.ihqqq.bosssummon.command;

import me.ihqqq.bosssummon.config.EventConfigLoader;
import me.ihqqq.bosssummon.config.SummonEvent;
import me.ihqqq.bosssummon.session.SummonEventManager;
import me.ihqqq.bosssummon.session.SummonSession;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BossSummonCommand implements CommandExecutor, TabCompleter {

    private final Plugin plugin;
    private final SummonEventManager manager;

    public BossSummonCommand(Plugin plugin, SummonEventManager manager) {
        this.plugin = plugin;
        this.manager = manager;
    }

    private static final String PERM = "bosssummon.admin";

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            sendHelp(sender);
            return true;
        }

        switch (args[0].toLowerCase()) {
            case "start":
                return handleStart(sender, args);
            case "cancel":
                return handleCancel(sender, args);
            case "list":
                return handleList(sender);
            case "reload":
                return handleReload(sender);
            case "status":
                return handleStatus(sender, args);
            default:
                sendHelp(sender);
                return true;
        }
    }

    private boolean handleStart(CommandSender sender, String[] args) {
        if (!sender.hasPermission(PERM)) {
            sender.sendMessage(ChatColor.RED + "Ban khong co quyen dung lenh nay.");
            return true;
        }
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Cach dung: /bosssummon start <eventId> [x y z the-gioi]");
            return true;
        }
        String eventId = args[1];

        Location override = null;
        if (args.length >= 5) {
            try {
                double x = Double.parseDouble(args[2]);
                double y = Double.parseDouble(args[3]);
                double z = Double.parseDouble(args[4]);
                String worldName = args.length >= 6 ? args[5]
                        : (sender instanceof Player ? ((Player) sender).getWorld().getName() : null);
                if (worldName == null) {
                    sender.sendMessage(ChatColor.RED + "Ban phai chi ro the gioi khi chay tu console.");
                    return true;
                }
                org.bukkit.World world = plugin.getServer().getWorld(worldName);
                if (world == null) {
                    sender.sendMessage(ChatColor.RED + "The gioi '" + worldName + "' khong ton tai.");
                    return true;
                }
                override = new Location(world, x, y, z);
            } catch (NumberFormatException ex) {
                sender.sendMessage(ChatColor.RED + "Toa do khong hop le.");
                return true;
            }
        } else if (sender instanceof Player) {
            override = ((Player) sender).getLocation();
        }

        SummonEventManager.StartResult result = manager.startEvent(eventId, override, sender);
        switch (result) {
            case SUCCESS:
                sender.sendMessage(ChatColor.GREEN + "Da bat dau su kien trieu hoi '" + eventId + "'.");
                break;
            case UNKNOWN_EVENT:
                sender.sendMessage(ChatColor.RED + "Khong tim thay su kien '" + eventId + "' trong config.yml.");
                break;
            case ALREADY_RUNNING:
                sender.sendMessage(ChatColor.RED + "Su kien '" + eventId + "' dang chay roi.");
                break;
            case NO_LOCATION:
                sender.sendMessage(ChatColor.RED + "Khong xac dinh duoc vi tri trieu hoi. Hay cung cap toa do hoac dung lenh trong game.");
                break;
        }
        return true;
    }

    private boolean handleCancel(CommandSender sender, String[] args) {
        if (!sender.hasPermission(PERM)) {
            sender.sendMessage(ChatColor.RED + "Ban khong co quyen dung lenh nay.");
            return true;
        }
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Cach dung: /bosssummon cancel <eventId>");
            return true;
        }
        boolean ok = manager.cancelEvent(args[1], true);
        if (ok) {
            sender.sendMessage(ChatColor.YELLOW + "Da huy su kien '" + args[1] + "'.");
        } else {
            sender.sendMessage(ChatColor.RED + "Su kien '" + args[1] + "' hien khong chay.");
        }
        return true;
    }

    private boolean handleList(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "== Cac su kien da dinh nghia ==");
        for (SummonEvent def : manager.getDefinitions().values()) {
            boolean running = manager.getActiveSession(def.getId()).isPresent();
            sender.sendMessage((running ? ChatColor.GREEN + "* " : ChatColor.GRAY + "- ")
                    + def.getId() + ChatColor.RESET + " - " + def.getDisplayName()
                    + (running ? ChatColor.GREEN + " (dang chay)" : ""));
        }
        return true;
    }

    private boolean handleStatus(CommandSender sender, String[] args) {
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Cach dung: /bosssummon status <eventId>");
            return true;
        }
        var opt = manager.getActiveSession(args[1]);
        if (opt.isEmpty()) {
            sender.sendMessage(ChatColor.RED + "Su kien '" + args[1] + "' hien khong chay.");
            return true;
        }
        SummonSession s = opt.get();
        sender.sendMessage(ChatColor.GOLD + "Su kien: " + s.getEvent().getDisplayName());
        sender.sendMessage(ChatColor.GRAY + "Tien trinh: " + ChatColor.WHITE + s.getTotalKilled() + "/" + s.getTotalRequired());
        sender.sendMessage(ChatColor.GRAY + "Thoi gian con lai: " + ChatColor.WHITE + s.getSecondsRemaining() + "s");
        return true;
    }

    private boolean handleReload(CommandSender sender) {
        if (!sender.hasPermission(PERM)) {
            sender.sendMessage(ChatColor.RED + "Ban khong co quyen dung lenh nay.");
            return true;
        }
        plugin.reloadConfig();
        Map<String, SummonEvent> defs = new EventConfigLoader(plugin).loadAll();
        manager.setDefinitions(defs);
        manager.reloadGlobalSettings();
        sender.sendMessage(ChatColor.GREEN + "Da nap lai config.yml (" + defs.size() + " su kien). "
                + "Luu y: cac su kien dang chay se KHONG bi anh huong.");
        return true;
    }

    private void sendHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "== BossSummonEvent ==");
        sender.sendMessage(ChatColor.YELLOW + "/bosssummon start <eventId> [x y z the-gioi]" + ChatColor.GRAY + " - Bat dau su kien");
        sender.sendMessage(ChatColor.YELLOW + "/bosssummon cancel <eventId>" + ChatColor.GRAY + " - Huy su kien dang chay");
        sender.sendMessage(ChatColor.YELLOW + "/bosssummon status <eventId>" + ChatColor.GRAY + " - Xem tien trinh");
        sender.sendMessage(ChatColor.YELLOW + "/bosssummon list" + ChatColor.GRAY + " - Liet ke cac su kien");
        sender.sendMessage(ChatColor.YELLOW + "/bosssummon reload" + ChatColor.GRAY + " - Nap lai config.yml");
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (args.length == 1) {
            return filter(List.of("start", "cancel", "status", "list", "reload"), args[0]);
        }
        if (args.length == 2 && List.of("start", "cancel", "status").contains(args[0].toLowerCase())) {
            return filter(new ArrayList<>(manager.getDefinitions().keySet()), args[1]);
        }
        return List.of();
    }

    private List<String> filter(List<String> options, String prefix) {
        return options.stream()
                .filter(o -> o.toLowerCase().startsWith(prefix.toLowerCase()))
                .collect(Collectors.toList());
    }
}