/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    this.element = element;
    if(!this.element) {
      throw new Error('Нет счета')
    };

    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    let options;
    if(this.lastOptions) {
      options = this.lastOptions;
    }
    this.render(options);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const btnRemoveAccount = this.element.querySelector('.remove-account');

    const content = this.element.querySelector('.content');

    btnRemoveAccount.addEventListener('click', (event) => {
      event.preventDefault();
      this.removeAccount()
    })

    content.addEventListener('click', (event) => {
      event.preventDefault();
      const btn = event.target.closest('.transaction__remove');
      if(btn) {
        this.removeTransaction(btn.dataset.id);
      }
    })

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(!this.lastOptions) {
      return;
    }
    
    const data = {
      id: this.lastOptions.account_id,
    }
    const chek = confirm('Вы действительно хотите удалить счёт?');
    if(!chek) {
      return;
    }

    Account.remove(data, (error, response) => {
      if(response.success === true) {
        App.getWidget("accounts").update();;
        App.updateForms();
        this.clear();
      }
    })

  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const data = {
      id,
    }
    const chek = confirm('Вы действительно хотите удалить счёт?');
    if(!chek) {
      return;
    }

    Transaction.remove(data, (error, response) =>{
      if(response.success) {
        App.update();
      }
    })
  }
  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if(!options) {
      return
    }
 
    this.lastOptions = options;

    const id = options.account_id;

    Account.get(id, (error, response) => {
      if(response.success === true) {
     
        const account = response.data.filter((item) => {
          if(item.id === id) {
            return true
          }
        });

        const name = account[0].name;

        this.renderTitle(name);

        Transaction.list(options, (error, response) => {

          this.renderTransactions(response.data)
        })
      }
    })
  }



  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const title = this.element.querySelector('.content-title');
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const newDate = new Date(date); 
    const dateNow = newDate.getDate();
    const monthNumber = newDate.getMonth();
    
    let month;
    switch(monthNumber) {
      case 0:  
       month = 'января'
       break

      case 1:  
       month = 'февраяля'
       break

      case 2:  
       month = 'марта'
       break  

      case 3:  
       month = 'апреля'
       break

      case 4:  
       month = 'мая'
       break

      case 5:  
       month = 'июня'
       break
      case 6:  
       month = 'июля'
       break

      case 7:  
       month = 'августа'
       break

      case 8:  
       month = 'сентября'
       break

      case 9:  
       month = 'октября'
       break

      case 10:  
       month = 'ноября'
       break

      case 11:  
       month = 'декабря'
       break
    }

    const year = newDate.getFullYear();
    let hours = newDate.getHours();
    if(hours < 10) hours = '0' + hours;
    
    let minutes = newDate.getMinutes();
    if(minutes < 10) minutes = '0' + minutes;

    const fullNewDate = `${dateNow} ${month} ${year} г. в ${hours}:${minutes}`;
   
    return fullNewDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const transaction = document.createElement('div');
    const classType = `transaction_${item.type}`;
    const date = this.formatDate(item.created_at);
    
    transaction.classList.add('transaction', classType, 'row');

    transaction.innerHTML = `<div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${date}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${item.sum}
        <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
      <button class="btn btn-danger transaction__remove" data-id="${item.id}">
        <i class="fa fa-trash"></i>  
      </button>
    </div>`

    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    content.innerHTML = '';

    data.forEach((item) => {
      const newItem = this.getTransactionHTML(item);
      content.append(newItem);
    })
  }
}