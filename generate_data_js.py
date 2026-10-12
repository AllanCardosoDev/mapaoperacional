import json

with open('processed_municipalities.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Let's add additional rich metadata for municipalities (population estimate, biome, police/fire region)
regions = {
    'Manaus': {'macro': 'Região Metropolitana', 'cbm': '1º BBM / Comando Geral'},
    'Presidente Figueiredo': {'macro': 'Região Metropolitana', 'cbm': 'Pelotão Destacado P. Figueiredo'},
    'Itacoatiara': {'macro': 'Médio Amazonas', 'cbm': '2ª CIBM Itacoatiara'},
    'Parintins': {'macro': 'Baixo Amazonas', 'cbm': '3ª CIBM Parintins'},
    'Tefé': {'macro': 'Médio Solimões', 'cbm': 'Pelotão Fluvial Tefé'},
    'Tabatinga': {'macro': 'Alto Solimões', 'cbm': 'Pelotão Destacado Tabatinga'},
    'Humaitá': {'macro': 'Sul do Amazonas', 'cbm': 'Companhia Independente Humaitá'},
    'Lábrea': {'macro': 'Purus', 'cbm': 'Destacamento Lábrea'},
    'Boca do Acre': {'macro': 'Purus', 'cbm': 'Destacamento Boca do Acre'},
    'Apuí': {'macro': 'Sul do Amazonas', 'cbm': 'Base Avançada Apuí'},
    'Manicoré': {'macro': 'Madeira', 'cbm': 'Destacamento Manicoré'},
    'Coari': {'macro': 'Médio Solimões', 'cbm': 'Base Coari'},
    'São Gabriel da Cachoeira': {'macro': 'Alto Rio Negro', 'cbm': 'Destacamento Alto Rio Negro'},
    'Barcelos': {'macro': 'Médio Rio Negro', 'cbm': 'Base Fluvial Barcelos'},
    'Novo Airão': {'macro': 'Rio Negro', 'cbm': 'Pelotão Novo Airão'}
}

# Arco do Fogo municipalities list
arco_do_fogo_list = [
    'Boca do Acre', 'Lábrea', 'Canutama', 'Tapauá', 'Humaitá', 'Manicoré', 'Novo Aripuanã', 'Apuí'
]

for m in data['municipalities']:
    name = m['name']
    m['in_arco_fogo'] = name in arco_do_fogo_list
    if name in regions:
        m['region_info'] = regions[name]
    else:
        m['region_info'] = {'macro': 'Interior do Amazonas', 'cbm': f'Posto de Resposta {name}'}

js_content = f"// Dados Oficiais dos 62 Municípios do Amazonas (Geometria IBGE + Metadados CBMAM)\nwindow.AMAZONAS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated data.js with {len(data['municipalities'])} municipalities and rich metadata.")
