/**
 * Gerenciamento de cache usando Drive
 */
class Cache {
  static resetCache() {
    Cache.clearCache();
  }

  static inicializaAtivos(tokens) {
    return tokens.map(nome => ({ nome, precos: [], tendencias: [0], estrategia: null, status: null }));
  }

  static saveAtivosCache(ativos) {
    const json = JSON.stringify(ativos);
    const prop = PropertiesService.getScriptProperties();
    let folder = prop.getProperty('ATIVOS_FOLDER_ID')
      ? DriveApp.getFolderById(prop.getProperty('ATIVOS_FOLDER_ID'))
      : DriveApp.createFolder('AtivosCache');

    if (!prop.getProperty('ATIVOS_FOLDER_ID')) prop.setProperty('ATIVOS_FOLDER_ID', folder.getId());
    const files = folder.getFilesByName('ativos_data.json');

    if (files.hasNext()) files.next().setContent(json);
    else folder.createFile('ativos_data.json', json, MimeType.PLAIN_TEXT);
  }

  static loadAtivosCache() {
    const prop = PropertiesService.getScriptProperties();
    if (!prop.getProperty('ATIVOS_FOLDER_ID')) return null;
    const folder = DriveApp.getFolderById(prop.getProperty('ATIVOS_FOLDER_ID'));
    const files = folder.getFilesByName('ativos_data.json');
    if (!files.hasNext()) return null;
    const raw = JSON.parse(files.next().getBlob().getDataAsString());
    return raw.map(o => ({ ...o }));
  }

    /**
   * Limpa todo o cache de ativos:
   * - marca como lixeira os arquivos JSON
   * - marca como lixeira a pasta de cache
   * - apaga a propriedade ATIVOS_FOLDER_ID
   */
  static clearCache() {
    const prop = PropertiesService.getScriptProperties();
    const folderId = prop.getProperty('ATIVOS_FOLDER_ID');
    if (folderId) {
      try {
        const folder = DriveApp.getFolderById(folderId);
        // mover todos os arquivos para a lixeira
        const files = folder.getFilesByName('ativos_data.json');
        while (files.hasNext()) {
          files.next().setTrashed(true);
        }
        // opcional: remover a própria pasta
        folder.setTrashed(true);
        // apagar a propriedade
        prop.deleteProperty('ATIVOS_FOLDER_ID');
        Logger.log('Cache de ativos limpo com sucesso.');
      } catch (e) {
        Logger.log('Erro ao limpar o cache: ' + e.message);
      }
    } else {
      Logger.log('Não há cache para limpar.');
    }
  }
}