/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
    if(!this.element) {
      throw new Error('Нет транзакции')
    }

    this.registerEvents()
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeBtn = this.element.querySelector('.create-income-button');
    const expenseBtn = this.element.querySelector('.create-expense-button');

    incomeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const modal = App.getModal('newIncome');
      modal.open();
    })

    expenseBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const modal = App.getModal('newExpense');
      modal.open()
    })
  }
}
