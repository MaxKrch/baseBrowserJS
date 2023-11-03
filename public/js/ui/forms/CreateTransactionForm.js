/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current();
    if(user) {
      const data = {
        id: user.id,
      }

      Account.list(data, (error, response) => {
        if(response.success === true) {
          const select = this.element.querySelector('.accounts-select');
          select.innerHTML = '';
           
          response.data.forEach((item) => {
            const option = document.createElement('option');
            option.setAttribute('value', item.id);
            option.textContent = item.name;
           
            select.append(option)
          })
        }
      })
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (error, response) => {
      if(response.success === true) {
        this.element.reset();
        
        let nameModal = data.type;
       
        let splitNameModal = nameModal.split('');
        const firs = splitNameModal[0].toUpperCase();

        splitNameModal[0] = firs;
        nameModal = splitNameModal.join('');
        nameModal = `new${nameModal}`;
    
        const modal = App.getModal(nameModal);
        modal.close();
        App.update();
      }
    })

  }
}