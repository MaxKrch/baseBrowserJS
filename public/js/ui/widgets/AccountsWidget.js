/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    this.element = element;
    if(!this.element) {
      throw new Error('Пользователь не авторизован');     
    }

    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = this.element.querySelector('.create-account');
    createAccount.addEventListener('click', (event) => {
      event.preventDefault();
      const modal = App.getModal('createAccount');
      modal.open();
    });

    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      const itemLi = event.target.closest('li');
      if(itemLi.classList.contains('account')) {
        this.onSelectAccount(itemLi);
      }
    })
    // existAccounts.forEach((item) => {
    //   item.addEventListener('click', (event) => {
    //     this.onSelectAccount(event)
    //   })
    // })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current();
    if(user) {
      const data = {
        id: user.id,
      }
      Account.list(data, (error, response) => {
        if(response.success === true) {
          this.clear();
          this.renderItem(response.data);
        
        }
       })      
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const existAccounts = Array.from(this.element.querySelectorAll('.account'));

    existAccounts.forEach((item) => {
      item.remove()
    })

  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeLi = this.element.querySelector('.active');
    const data = {
      account_id: element.dataset.id,
    }

    if(activeLi) {
      activeLi.classList.remove('active');
    }
    element.classList.add('active');
    
    App.showPage('transactions', data)

  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const itemLi = document.createElement('li');
    itemLi.classList.add('account');
    itemLi.dataset.id = item.id;

    itemLi.innerHTML = ` <a href="#">
      <span>${item.name}</span> 
      /
      <span>${item.sum} ₽</span>
    </a>`
   
    return itemLi;

  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    let newHTML;
    
    data.forEach((item) => {
      const newLi = this.getAccountHTML(item);
      this.element.append(newLi);
    })

  }
}
