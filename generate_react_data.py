import json

with open('processed_municipalities.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Arco do Fogo list
arco_list = [
    'Boca do Acre', 'Lábrea', 'Canutama', 'Tapauá', 'Humaitá', 'Manicoré', 'Novo Aripuanã', 'Apuí'
]

# Region information for all 62 municipalities
region_map = {
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
    'Novo Aripuanã': {'macro': 'Madeira', 'cbm': 'Destacamento Novo Aripuanã'},
    'Canutama': {'macro': 'Purus', 'cbm': 'Posto Avançado Canutama'},
    'Tapauá': {'macro': 'Purus', 'cbm': 'Posto Avançado Tapauá'},
    'Coari': {'macro': 'Médio Solimões', 'cbm': 'Base Coari'},
    'São Gabriel da Cachoeira': {'macro': 'Alto Rio Negro', 'cbm': 'Destacamento Alto Rio Negro'},
    'Barcelos': {'macro': 'Médio Rio Negro', 'cbm': 'Base Fluvial Barcelos'},
    'Novo Airão': {'macro': 'Rio Negro', 'cbm': 'Pelotão Novo Airão'},
    'Maués': {'macro': 'Baixo Amazonas', 'cbm': 'Pelotão Destacado Maués'},
    'Borba': {'macro': 'Madeira', 'cbm': 'Posto Avançado Borba'},
    'Eirunepé': {'macro': 'Juruá', 'cbm': 'Posto de Resposta Eirunepé'},
    'Carauari': {'macro': 'Juruá', 'cbm': 'Posto de Resposta Carauari'}
}

for m in data['municipalities']:
    name = m['name']
    m['in_arco_fogo'] = name in arco_list
    if name in region_map:
        m['region_info'] = region_map[name]
    else:
        m['region_info'] = {'macro': 'Interior do Amazonas', 'cbm': f'Posto de Resposta {name}'}

content = f"// Dados Geográficos Oficiais dos 62 Municípios do Amazonas (IBGE + CBMAM)\nexport const AMAZONAS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

with open('src/data/amazonasData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Generated src/data/amazonasData.js successfully!")
