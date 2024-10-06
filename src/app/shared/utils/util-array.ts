export abstract class UtilArray {
  static removeItem<T>(arr: Array<T>, item: T): boolean {
    const index = arr.indexOf(item);
    if (index === -1) return false;

    arr.splice(index, 1);
    return true;
  }

  /**
   * Modifica a referência de um item do array. Não mantém o index do item (nova ref é inserida no final).
   */
  static atualizarRefItem<T>(arr: Array<T>, refAntiga: T, novaRef: T): boolean {
    const index = arr.indexOf(refAntiga);

    if (index === -1) return false;

    arr.splice(index, 1);
    arr.push(novaRef);

    return true;
  }
}