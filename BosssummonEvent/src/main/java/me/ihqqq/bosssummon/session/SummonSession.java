package me.ihqqq.bosssummon.session;

import me.ihqqq.bosssummon.config.KillRequirement;
import me.ihqqq.bosssummon.config.SummonEvent;
import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;
import org.bukkit.boss.BossBar;
import org.bukkit.entity.Player;

import java.util.LinkedHashMap;
import java.util.Map;

public class SummonSession {

    public enum State {
        RUNNING,
        COMPLETED,
        CANCELLED
    }

    private final SummonEvent event;
    private final Location summonLocation;
    private final BossBar bossBar;
    private final Map<String, Integer> progress = new LinkedHashMap<>(); // key = KillRequirement.key()
    private final int totalRequired;

    private int secondsRemaining;
    private State state = State.RUNNING;
    private int countdownTaskId = -1;

    public SummonSession(SummonEvent event, Location summonLocation) {
        this.event = event;
        this.summonLocation = summonLocation;
        this.totalRequired = event.getTotalRequiredAmount();
        this.secondsRemaining = event.getTimeLimitSeconds();

        for (KillRequirement req : event.getRequirements()) {
            progress.put(req.key(), 0);
        }

        BarColor color = event.getBossBarSettings().getColor();
        BarStyle style = event.getBossBarSettings().getStyle();
        this.bossBar = Bukkit.createBossBar("", color, style);
    }

    public SummonEvent getEvent() {
        return event;
    }

    public Location getSummonLocation() {
        return summonLocation;
    }

    public BossBar getBossBar() {
        return bossBar;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public int getSecondsRemaining() {
        return secondsRemaining;
    }

    public void decrementSecond() {
        this.secondsRemaining = Math.max(0, secondsRemaining - 1);
    }

    public int getCountdownTaskId() {
        return countdownTaskId;
    }

    public void setCountdownTaskId(int countdownTaskId) {
        this.countdownTaskId = countdownTaskId;
    }

    public int addProgress(KillRequirement requirement, int amount) {
        int current = progress.getOrDefault(requirement.key(), 0);
        int max = requirement.getAmount();
        int updated = Math.min(max, current + amount);
        int delta = updated - current;
        progress.put(requirement.key(), updated);
        return delta;
    }

    public int getProgressFor(KillRequirement requirement) {
        return progress.getOrDefault(requirement.key(), 0);
    }

    public int getTotalKilled() {
        return progress.values().stream().mapToInt(Integer::intValue).sum();
    }

    public int getTotalRequired() {
        return totalRequired;
    }

    public boolean isComplete() {
        for (KillRequirement req : event.getRequirements()) {
            if (getProgressFor(req) < req.getAmount()) {
                return false;
            }
        }
        return true;
    }

    public void refreshBossBar(String renderedTitle) {
        bossBar.setTitle(renderedTitle);
        double prog = totalRequired == 0 ? 1.0 : Math.min(1.0, (double) getTotalKilled() / (double) totalRequired);
        bossBar.setProgress(prog);
    }

    public void addViewer(Player player) {
        bossBar.addPlayer(player);
    }

    public void removeAllViewers() {
        bossBar.removeAll();
    }
}