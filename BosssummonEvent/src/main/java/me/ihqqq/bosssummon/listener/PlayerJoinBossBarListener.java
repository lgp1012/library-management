package me.ihqqq.bosssummon.listener;

import me.ihqqq.bosssummon.session.SummonEventManager;
import me.ihqqq.bosssummon.session.SummonSession;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerChangedWorldEvent;

public class PlayerJoinBossBarListener implements Listener {

    private final SummonEventManager manager;

    public PlayerJoinBossBarListener(SummonEventManager manager) {
        this.manager = manager;
    }

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        addIfSameWorld(event.getPlayer());
    }

    @EventHandler
    public void onChangeWorld(PlayerChangedWorldEvent event) {
        addIfSameWorld(event.getPlayer());
    }

    private void addIfSameWorld(Player player) {
        for (SummonSession session : manager.getActiveSessions().values()) {
            if (session.getSummonLocation().getWorld() != null
                    && session.getSummonLocation().getWorld().equals(player.getWorld())) {
                session.addViewer(player);
            }
        }
    }
}