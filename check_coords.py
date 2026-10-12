import json

with open('processed_municipalities.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for m in data['municipalities']:
    if m['name'] in ['Manaus', 'Presidente Figueiredo', 'Itacoatiara', 'Parintins', 'Novo Airão', 'Boca do Acre', 'Apuí', 'Humaitá', 'Lábrea', 'Tefé']:
        print(f"{m['name']}: cx={m['cx']}, cy={m['cy']}")
