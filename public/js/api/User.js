/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {

  static URL = '/user'
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    const newUser = {
      id: user.id,
      name: user.name,
    }
    const currentUser = JSON.stringify(newUser);
    localStorage.setItem('user', currentUser); 

  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');

  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    let currentUser;
    const userFromLocalStorage = localStorage.getItem('user');
   
    if(userFromLocalStorage) {
      currentUser = JSON.parse(userFromLocalStorage)
    }

    return currentUser;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    const newCallback = (error, response) => {
        if(response.success === true) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }
         callback(error, response)
      } 
 
    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      data: {},
      callback: newCallback
    })

  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (error, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(error, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    const url = this.URL + '/register';
    const method = 'POST';
    const newCallback = (error, response) => {
      if(response.success === true) {
        this.setCurrent(response.user)
      }
      callback(error, response) 

    }

    createRequest({
      url,
      method,
      data,
      callback: newCallback,
    })

  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    const url = this.URL + '/logout';
    const method = 'POST';
    const data = {};
    const newCallback = (error, response) => {
      if(response.success === true) {
        this.unsetCurrent()
      }
      callback(error, response)
    }

    createRequest({
      url,
      method,
      data,
      callback: newCallback,
    })
  }
}
