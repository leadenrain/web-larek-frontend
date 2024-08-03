https://github.com/leadenrain/web-larek-frontend.git

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/sccs/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

**TProduct**

Тип данных товара:
- `id: string` - идентификатор
- `description: string` - описание
- `image: string` - изображение
- `title: string` - название
- `category: string` - категория
- `price: number | null` - цена

**IOrderData**

Интерфейс типизирует данные покупателя:
- `payment: 'cash' | 'card'` - способ оплаты заказа
- `address: string` - адрес доставки
- `email: string` - электронная почта
- `phone: string` - номер телефона

**IBasketData**  

Интерфейс типизирует данные корзины:
- `items: TProduct[]` - список товаров
- `total: number` - итоговая сумма

**Данные пользователя в форме заказа**

- `type TPaymentMethod = 'cash' | 'card'` - тип для выбора способа оплаты
- `type TOrderPayment = Pick<IOrderData, 'payment' | 'address'>` - тип для формы с выбором оплаты и адресом
- `type TOrderContacts = Pick<IOrderData, 'email' | 'phone'>` - тип для формы с почтой и телефоном
- `type TOrderErrors<T> = Partial<Record<keyof T, string>>` - тип ошибок валидации форм

**Типы данных для работы с сервером**
- `type ApiListResponse<T> = { total: number; items: T[]};` - тип для получения данных

- `ApiPostMethods = 'POST' | 'PUT' | 'DELETE'` - типизация API-методов

- `TOrder = TOrderPayment & TOrderContacts & ApiListResponse<TProduct>` - тип сформированного заказа для отправки на сервер
- `TOrderSuccess = { id: string; total: number }` - тип успешного заказа

## Архитектура приложения

Код приложения разделен на слои согласно парадигме **MVP**: 
- *слой представления*. Отвечает за отображение данных на странице, 
- *слой данных*. Отвечает за хранение и изменение данных
- *презентер*. Отвечает за связь представления и данных.

Все свойства классов прописаны защищенными, что обеспечивает доступ к некоторым данным или функциональности только внутри класса и его наследников, но не извне. Это помогает инкапсулировать внутреннюю логику класса и предотвратить несанкционированный доступ к его внутренним данным.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

#### Класс Component<T>
Абстрактный класс для создания компонентов разметки. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. Содержит набор часто используемых в слое отображения методов. В конструктор передается контейнер HTML. Основные методы класса:
- `setText` - установка текстовго содержимого HTML-элемента
- `setImage` - установка изображения с альтернативным текстом
- `render` - получение корневого DOM-элемента. Отвечает за сохранение полученных в параметре данных в полях компонентов через их сеттеры.

### Слой данных

#### Класс WebLarekAPI
Класс расширяет базовый класс Api, реализуя интефейс ILarekAPI. Предназначен для работы с сервером приложения с помощью следующих методов:
- `getProductList` - выполняет запрос для получения каталога товаров, соответствующих интерфейсу TProduct
- `postOrder` - отправляет сформированный заказ на сервер, возвращая результат операции

#### Класс Catalog
Класс для работы с каталогом товаров. Реализует интерфейс ICatalog, предоставляя метод получения товара по id и сеттеры для размещения каталога и выбранного товара. В конструктор получает экземпляр брокера событий.
Свойства класса:
- `_products: TProduct[] = []` - каталог товаров в виде массива
- `_selectedProdId: string | null` - идентификатор товара

#### Класс Basket
Класс описывает логику работы с корзиной. В конструктор принимает экземпляр брокера событий, содержит геттер для получения списка товаров в корзине,а так же следующие методы:
- `addProduct` - добавление товара в корзину
- `removeProduct` - удаление товара из корзины
- `clear` - очищение корзины
- `isInBasket` - проверка наличия конкретного товара в корзине
- `getTotal` - получение общей суммы товаров
- `getCount` - получение количества товаров

#### Класс Order
Класс для работы с вводимыми пользователем данными, реализует интерфейс IOrder, принимает в конструктор экземпляр брокера событий. Свойства класса:
- `_payment` - выбор способа оплаты заказа
- `_address` - адрес доставки
- `_email` - электронная почта
- `_phone` - номер телефона
Для валидации полей ввода используюся методы `validatePaymentForm` и `validateContactsForm`, а для установки значений - сеттеры.

### Слой представления
Все классы представления отвечают за отображение внутри DOM-элемента передаваемых в него данных. Наследуются от базового класса Component<T>, используя его конструктор и методы. Так же в конструктор классы принимаю экземпляр брокера событий.

#### ProductView
Класс для 'отрисовки' карточки товара. В конструктор принимает шаблонный элемент. Шаблон используется для различного отображения одного и того же товара в разных частях приложения. 
Свойства класса представляют собой элементы разметки:
- `_id` - идентификатор товара (только для хранения, на странице не отображается)
- `_description` - описание товара (HTMLElement)
- `_category` - категория товара (HTMLSpanElement)
- `_title` - название товара (HTMLElement)
- `_image` - изображение товавра (HTMLImageElement)
- `_price` - стоимость товара (HTMLSpanElement)
- `_button` - кнопка для добавления/удаления товара из корзины(HTMLButtonElement)
- `_index` - порядковый номер товара в корзине (HTMLSpanElement)
Для сохранения значений свойств предоставлены сеттеры.
В зависимости от вида карточки товара установлены слушатели клика на сам товар для передачи данных через событие в модальное окно, и кнопку удаления из корзины.

#### FormView
Класс для отображения форм заказа на странице. Так как в приложении форма заказа разбита на 2 части, использует шаблонный элемент, чтобы избежать дублирования кода. Свойства класса:
- `payCard` - оплата картой (HTMLButtonElement);
- `payCash`- оплата наличными (HTMLButtonElement);
- `_address` - адрес доставки (HTMLInputElement);
- `_email`- электронная почта (HTMLInputElement);
- `_phone` - номер телефона (HTMLInputElement);
- `_submit` - кнопка отправки данных заблокирована по умолчанию(HTMLButtonElement);
- `_errors` - ошибки валидации (HTMLSpanElement)
Для сохранения значений свойств предоставлены сеттеры, для переключения способа оплаты - метод `togglePayment`.
Во время заполнения полей формы в брокер передается событие с данными этих полей для проверки на валидность и получения текста ошибки, если она есть. Текст ошибки передается через событие на 'отрисовку'. При успешном заполнении формы активируется кнопка, при клике на которую введенные данные передаются в событие для дальнейшего сохранения и перехода к следующему шагу заказа.

#### ModalView
Класс реализует модальное окно. Т.к. используется только 1 модальное окно, а содержимое меняется, в классе указано свойство `_content`. Какой контент устанавливается, зависит от события, принятого брокером. Вторым свойством является кнопка закрытия модального окна `closeButton`. Методы класса:
- сеттер для установки контента
- `open` - открытие модального окна
- `close` - закрытие модального окна
Установлены слушатели клика по кнопке закрытия модального окна и оверлею.

#### IBasketView
Класс отображает корзину пользователя. Поля:
- `_list`-список товаров (HTMLUListElement);
- `_total`- общая стоимость товаров (HTMLSpanElement);
- `button`- кнопка перехода к оформлению заказа (HTMLButtonElement);
- сеттеры для сохранения значений свойств
Установлен слушатель клика на кнопку оформления заказа. По клику данные корзины передаются в событие, брокер инициирует передачу контента(формы заказа) в модальное окно.

#### Другое
- `CatalogView` отвечает за вывод каталога товаров на страницу. В конструктор принимает контейнер для размещения товаров.
- `BasketIconView` изображение корзины в шапке страницы. Показывает/скрывает счетчик товаров, активирует/блокирует кнопку корзины.

## Взаимодействие компонентов
В файле index.ts распложен код, по сути выполняющий роль презентера. Он описывает взаимодействие между слоями данных и представления за счет генерируемых брокером событий и обработчиков этих событий.

### Список событий в приложении:



| Событие             | Триггер                     | Реакция                 |
|:--------------------|:----------------------------|:------------------------|
| catalog: change|загрузка каталога товаров| вывод на экран карточек товаров, установка слушателей |
| product: select|клик по карточке товара|получение id товара, установка значения в поле модели|
| preview: change|получение id |проверка id на наличие в корзине, передача темплейта превью товара в модальное окно |
|basket change: add|клик по кнопке добавления товара|получение данных, установка значений в поля модели,передача в модальное окно темплейтов: карточка товара в корзине, корзина, установка счетчика и слушателя на иконку корзины, активация иконки| 
|basket change: remove| клик по кнопке удаления товара|получение данных, установка новых значений в поля модели, вывод нового изображения корзины|
|basket change: clear |удаление последнего товара из корзины| удаление счетчика и слушателя на иконку корзины, деактивация иконки|
|order: change|клик по кнопке оформления заказа|сохранение данных корзины, передача в модальное окно темплейта формы первого шага оформления заказа|
|form change: \<field>|изменение вводимых пользователем данных| валидация, передача ошибок(если есть), установка значения в поле модели, активация кнопки перехода к следующему шагу оформления заказа|
|form error: \<field>|получение ошибки| вывод текста ошибки на экран|
|form: submit|нажатие кнопки| сохранение данных формы, передача в модальное окно темплейта формы следующего шага оформления заказа|
|order: ready| клик по кнопке оплаты заказа| передача данных заказа на сервер, передача в модальное окно темплейта с сообщением|
|order: success|клик по кнопке|очищает заполненные пользователем данные и корзину|
|modal open: \<content>|получение темплейта контента|вывод на экран модального окна с соответствующим  контентом, установка слушателей|
|modal close: \<content>|клик по кнопке закрытия модального окна или оверлею|удаление контента из модального окна, закрытие|

В файле index.ts создаотся экземпляры всех необходимых классов и настраивается обработка событий.