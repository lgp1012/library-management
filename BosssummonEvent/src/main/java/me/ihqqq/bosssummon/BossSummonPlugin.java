package me.ihqqq.bosssummon;

import me.ihqqq.bosssummon.command.BossSummonCommand;
import me.ihqqq.bosssummon.config.EventConfigLoader;
import me.ihqqq.bosssummon.config.SummonEvent;
import me.ihqqq.bosssummon.listener.MobKillListener;
import me.ihqqq.bosssummon.listener.PlayerJoinBossBarListener;
import me.ihqqq.bosssummon.session.SummonEventManager;
import org.bukkit.plugin.PluginManager;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.Map;
import java.util.Objects;

public final class BossSummonPlugin extends JavaPlugin {

    private SummonEventManager summonEventManager;

    @Override
    public void onEnable() {
        // MythicMobs phai duoc bat truoc (da khai bao 'depend' trong plugin.yml nen Bukkit dam bao thu tu nay,
        // nhung kiem tra lai cho chac chan).
        if (getServer().getPluginManager().getPlugin("MythicMobs") == null) {
            getLogger().severe("Khong tim thay MythicMobs! Plugin nay se bi vo hieu hoa.");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }

        saveDefaultConfig();

        Map<String, SummonEvent> definitions = new EventConfigLoader(this).loadAll();
        summonEventManager = new SummonEventManager(this, definitions);

        PluginManager pm = getServer().getPluginManager();
        pm.registerEvents(new MobKillListener(summonEventManager), this);
        pm.registerEvents(new PlayerJoinBossBarListener(summonEventManager), this);

        BossSummonCommand cmd = new BossSummonCommand(this, summonEventManager);
        Objects.requireNonNull(getCommand("bosssummon")).setExecutor(cmd);
        Objects.requireNonNull(getCommand("bosssummon")).setTabCompleter(cmd);

        getLogger().info("BossSummonEvent da duoc kich hoat voi " + definitions.size() + " su kien.");
    }

    @Override
    public void onDisable() {
        if (summonEventManager != null) {
            summonEventManager.shutdownAll();
        }
    }

    public SummonEventManager getSummonEventManager() {
        return summonEventManager;
    }
}