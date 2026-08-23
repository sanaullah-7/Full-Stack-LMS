import os

file_path = 'src/styles/legacy-theme.css'
with open(file_path, 'r') as f:
    content = f.read()

# 1. card-header padding
content = content.replace(
    '  padding: 1.5rem 1.5rem 0;',
    '  padding: 1.25rem 1.25rem 0;'
)

# 2. welcome-banner padding
content = content.replace(
    '  padding: 1.75rem 2rem;',
    '  padding: 1.25rem 1.5rem;'
)

# 3. dashboard grid gap
content = content.replace(
    '.dashboard-grid {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 1.5rem;',
    '.dashboard-grid {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 1.25rem;'
)

# 4. stat-card.big padding
content = content.replace(
    '.stat-card.big {\n  padding: 1.5rem 1.75rem;',
    '.stat-card.big {\n  padding: 1.25rem 1.5rem;'
)

# 5. stat-number.huge font-size
content = content.replace(
    '.stat-number.huge {\n  font-size: 2.6rem;\n  font-weight: 600;',
    '.stat-number.huge {\n  font-size: 1.8rem;\n  font-weight: 600;'
)

# 6. dashboard upcoming tasks padding
content = content.replace(
    '.task-checklist {\n  padding: 0 1.5rem 1.5rem;',
    '.task-checklist {\n  padding: 0 1.25rem 1.25rem;'
)

# 7. dashboard activity feed padding
content = content.replace(
    '.activity-feed {\n  padding: 0 1.5rem 1.5rem;',
    '.activity-feed {\n  padding: 0 1.25rem 1.25rem;'
)

with open(file_path, 'w') as f:
    f.write(content)

print("legacy-theme.css updated.")
