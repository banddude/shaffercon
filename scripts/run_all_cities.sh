#!/bin/bash
# Run gen_closing.py for all remaining cities in priority order.
# Logs each city's run to /tmp/closing-content-runs/<city>-<timestamp>.log
# Designed to run unattended for a few hours.

set -u
cd /Users/mikeshaffer/AIVA/shaffercon

LOGDIR="/tmp/closing-content-runs"
mkdir -p "$LOGDIR"
MASTER_LOG="$LOGDIR/master-$(date +%Y%m%d-%H%M%S).log"

# City order: fire-rebuild relevance first, then by remaining-empty count desc
CITIES=(
  "altadena"          # 40 — Eaton Fire
  "pasadena"          # 18 — Eaton Fire
  "west hollywood"    # 39
  "echo park"         # 39
  "glendale"          # 38
  "atwater village"   # 38
  "venice"            # 37
  "santa clarita"     # 37
  "burbank"           # 37
  "culver city"       # 36
  "santa monica"      # 31
  "silver lake"       # 27
  "boyle heights"     # 18
  "hollywood"         # 16
  "torrance"          # 13
  "beverly hills"     # 12
  "long beach"        # 11
  "inglewood"         # 10
  "highland park"     # 10
  "sherman oaks"      # 8
  "los feliz"         # 8
)

echo "=== closing_content batch runner started at $(date) ===" | tee "$MASTER_LOG"
echo "Cities to process: ${#CITIES[@]}" | tee -a "$MASTER_LOG"
echo "" | tee -a "$MASTER_LOG"

TOTAL_START=$(date +%s)

for city in "${CITIES[@]}"; do
  TS=$(date +%Y%m%d-%H%M%S)
  CITY_SLUG=$(echo "$city" | tr ' ' '-')
  LOG="$LOGDIR/${CITY_SLUG}-${TS}.log"

  CITY_START=$(date +%s)
  echo "▶ [$(date '+%H:%M:%S')] Starting: $city" | tee -a "$MASTER_LOG"

  # Run the generator for this city
  python3 scripts/gen_closing.py --location "$city" > "$LOG" 2>&1
  EXIT=$?

  CITY_END=$(date +%s)
  ELAPSED=$((CITY_END - CITY_START))

  WRITTEN=$(grep -c "✓ Wrote to DB" "$LOG" 2>/dev/null || echo 0)
  ERRORS=$(grep -c "✗ Error after retries" "$LOG" 2>/dev/null || echo 0)

  echo "  ✓ [$(date '+%H:%M:%S')] Done: $city  pages=$WRITTEN errors=$ERRORS elapsed=${ELAPSED}s exit=$EXIT" | tee -a "$MASTER_LOG"
  echo "  log: $LOG" | tee -a "$MASTER_LOG"

  # Auto-commit + push if any pages were written this city
  if [ "$WRITTEN" -gt 0 ]; then
    cd /Users/mikeshaffer/AIVA/shaffercon
    git add database/data/site.db 2>/dev/null
    if ! git diff --staged --quiet; then
      git commit -m "Content: fill closing_content for $city ($WRITTEN pages, Haiku-generated)

Auto-committed by run_all_cities.sh batch runner. Each page is a
unique 1000-1500 char closing section referencing local $city
landmarks, services, and CTAs." -q 2>&1 | tee -a "$MASTER_LOG"
      git push origin main 2>&1 | tail -1 | tee -a "$MASTER_LOG"
      echo "  ↑ Auto-deployed: $WRITTEN $city pages" | tee -a "$MASTER_LOG"
    fi
  fi

  # If a city fully failed, pause longer before next
  if [ "$WRITTEN" -eq 0 ] && [ "$ERRORS" -gt 0 ]; then
    echo "  ⚠️  City failed entirely; sleeping 5 min before next" | tee -a "$MASTER_LOG"
    sleep 300
  else
    sleep 5
  fi
done

TOTAL_END=$(date +%s)
TOTAL_ELAPSED=$((TOTAL_END - TOTAL_START))

echo "" | tee -a "$MASTER_LOG"
echo "=== ALL CITIES PROCESSED in ${TOTAL_ELAPSED}s ($(($TOTAL_ELAPSED / 60))min) ===" | tee -a "$MASTER_LOG"
echo "Master log: $MASTER_LOG"
