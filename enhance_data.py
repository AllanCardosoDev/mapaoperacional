import json
import math

with open('processed_municipalities.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Let's inspect the municipalities
munis = data['municipalities']
print(f"Municipalities loaded: {len(munis)}")

# Let's define the callout positions for congested eastern/central municipalities
# just like on the physical board banner:
# On the physical board, lines extend to the right / top-right / top with labels!
callouts = {
    'Caapiranga': {'label_x': 1360, 'label_y': 100},
    'Manacapuru': {'label_x': 1420, 'label_y': 95},
    'Manaquiri': {'label_x': 1460, 'label_y': 130},
    'Iranduba': {'label_x': 1470, 'label_y': 170},
    'Anamã': {'label_x': 1350, 'label_y': 180},
    'Silves': {'label_x': 1580, 'label_y': 200},
    'Rio Preto da Eva': {'label_x': 1630, 'label_y': 255},
    'Autazes': {'label_x': 1660, 'label_y': 290},
    'Urucurituba': {'label_x': 1700, 'label_y': 310},
    'Boa Vista do Ramos': {'label_x': 1720, 'label_y': 330},
    'Barreirinha': {'label_x': 1740, 'label_y': 350},
    'Urucará': {'label_x': 1500, 'label_y': 260},
    'Nhamundá': {'label_x': 1800, 'label_y': 385},
    'Parintins': {'label_x': 1840, 'label_y': 420},
    'Nova Olinda do Norte': {'label_x': 1820, 'label_y': 600},
    'Careiro da Várzea': {'label_x': 1760, 'label_y': 635},
    'Careiro': {'label_x': 1450, 'label_y': 950},
}

for m in munis:
    name = m['name']
    if name in callouts:
        m['has_callout'] = True
        m['callout_x'] = callouts[name]['label_x']
        m['callout_y'] = callouts[name]['label_y']
    else:
        m['has_callout'] = False

# Palette matching the physical banner
custom_colors = {
    'São Gabriel da Cachoeira': '#FDE047', # Yellow
    'Santa Isabel do Rio Negro': '#DDD6FE', # Purple
    'Barcelos': '#BBF7D0', # Mint
    'Novo Airão': '#FED7AA', # Peach
    'Presidente Figueiredo': '#FEF08A', # Yellow
    'Manaus': '#FDE68A', # Yellow
    'Itacoatiara': '#A7F3D0', # Mint
    'Maués': '#BAE6FD', # Sky
    'Borba': '#7DD3FC', # Cyan
    'Novo Aripuanã': '#DDD6FE', # Lavender
    'Apuí': '#FDBA74', # Orange
    'Humaitá': '#86EFAC', # Light green
    'Manicoré': '#BEF264', # Lime
    'Canutama': '#A5F3FC', # Sky
    'Lábrea': '#E9D5FF', # Violet
    'Boca do Acre': '#FDE047', # Yellow
    'Tapauá': '#FCA5A5', # Rose/salmon
    'Coari': '#A7F3D0', # Mint
    'Tefé': '#FEF08A', # Yellow
    'Carauari': '#FED7AA', # Peach
    'Juruá': '#86EFAC', # Green
    'Japurá': '#BBF7D0', # Mint
    'Maraã': '#DDD6FE', # Purple
    'Fonte Boa': '#FECDD3', # Pink
    'Tonantins': '#FDE68A', # Yellow
    'Santo Antônio do Içá': '#FDBA74', # Orange
    'Tabatinga': '#FECDD3', # Pink
    'São Paulo de Olivença': '#FEF08A', # Yellow
    'Benjamin Constant': '#FDE047', # Yellow
    'Atalaia do Norte': '#CBD5E1', # Slate
    'Eirunepé': '#86EFAC', # Green
    'Envira': '#DDD6FE', # Purple
    'Ipixuna': '#FECDD3', # Pink
    'Guajará': '#FEF08A', # Yellow
    'Itamarati': '#FDE68A', # Yellow
    'Pauini': '#FED7AA', # Peach
    'Alvarães': '#FEF08A', # Yellow
    'Uarini': '#86EFAC', # Green
    'Codajás': '#DDD6FE', # Purple
    'Anori': '#FEF08A', # Yellow
    'Beruri': '#BBF7D0', # Mint
    'Parintins': '#BBF7D0', # Mint
    'Itapiranga': '#FEF08A', # Yellow
    'São Sebastião do Uatumã': '#DDD6FE', # Purple
    'Nhamundá': '#BAE6FD', # Sky
}

for m in munis:
    if m['name'] in custom_colors:
        m['color'] = custom_colors[m['name']]

with open('processed_municipalities.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated processed_municipalities.json successfully with custom styling and callouts!")
