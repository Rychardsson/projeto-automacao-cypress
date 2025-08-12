# Cypress CI Configuration

# Browser preferences for CI
export CYPRESS_CACHE_FOLDER="$HOME/.cache/Cypress"

# Disable GPU acceleration in CI
export DISPLAY=:99
export CYPRESS_RUN_BINARY="$HOME/.cache/Cypress/13.17.0/Cypress/Cypress"

# Performance settings
export NODE_OPTIONS="--max-old-space-size=4096"

# Debug settings (can be removed in production)
export DEBUG=""
export CYPRESS_CRASH_REPORTS=0
export CYPRESS_RECORD_KEY=""

# Test specific settings
export CYPRESS_defaultCommandTimeout=10000
export CYPRESS_requestTimeout=5000
export CYPRESS_responseTimeout=30000
export CYPRESS_pageLoadTimeout=60000

echo "🔧 Cypress CI environment configured"
