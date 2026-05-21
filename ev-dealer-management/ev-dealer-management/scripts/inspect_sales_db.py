import sqlite3
import json
from pathlib import Path

db = Path(__file__).parents[1] / 'SalesService' / 'sales.db'
print('DB path:', db)
if not db.exists():
    print('ERROR: DB not found')
    raise SystemExit(1)

con = sqlite3.connect(str(db))
con.row_factory = sqlite3.Row
cur = con.cursor()

def table_info(tbl):
    cur.execute(f"PRAGMA table_info('{tbl}')")
    cols = [dict(row) for row in cur.fetchall()]
    return cols

for t in ['Orders','OrderItems']:
    print('\n--- TABLE:', t, '---')
    try:
        cols = table_info(t)
        print('Columns:')
        for c in cols:
            print(' ', c['cid'], c['name'], c['type'], 'pk=' + str(c['pk']))
        cur.execute(f"SELECT * FROM '{t}' LIMIT 5")
        rows = [dict(r) for r in cur.fetchall()]
        print('Sample rows (up to 5):')
        print(json.dumps(rows, indent=2, ensure_ascii=False))
    except Exception as e:
        print('  ERROR reading table', t, e)

# Print migrations history
print('\n--- __EFMigrationsHistory ---')
try:
    cur.execute("SELECT MigrationId, ProductVersion FROM __EFMigrationsHistory ORDER BY MigrationId")
    print(json.dumps([dict(r) for r in cur.fetchall()], indent=2, ensure_ascii=False))
except Exception as e:
    print('  ERROR reading __EFMigrationsHistory', e)

con.close()
