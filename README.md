https://github.com/leadenrain/web-larek-frontend.git

# Проектная работа "Веб-ларек". 

weblarёk - это интернет-магазин для веб-разработчиков, где можно посмотреть каталог товаров, добавить выбранные товары в корзину и оформить заказ. 

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

### Установка и запуск
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
### Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

**IProduct**

Товар:
- `id: string` - идентификатор
- `description: string` - описание
- `image: string` - изображение
- `title: string` - название
- `category: string` - категория
- `price: number | null` - цена

**ICatalog**

Каталог товаров:
- `products: IProduct[]` - массив товаров
- `selectedProductId: string | null` - выбранный товар
- `getProduct: (id: string) => IProduct` - получение товара по id

**IBasket**  

Интерфейс типизирует данные корзины:
- `items: IProduct[]` - список товаров
- `addProduct: (item: IProduct) => void` - добавление товара в корзину
- `removeProduct: (id: string) => void` - удаление товара из корзины
- `clear: () => void` - очищение корзины
- `isInBasket: (id: string) => boolean` - проверка наличия конкретного товара в корзине
- `getTotal: () => number` - полуение общей уммы корзины
- `getCount: () => number` - получение количества товаров в корзине
- `isEmpty: () => boolean` - проверка на пустую корзину

**IForm**

Формы:
- `payment: string` - способ оплаты заказа 
- `address: string` - адрес доставки
- `email: string` - электронная почта
- `phone: string` - номер телефона
- `updateOrderFields: (field: keyof TFields, value: string) => void` - обновление полей ввода первой формы
- `updateContactsFields: (field: keyof TFields, value: string) => void` - обновление полей ввода второй формы
- `checkValidityOrder: () => string | true` - проверка валидности первой формы
- `checkValidityContacts: () => boolean` - проверка валидности второй формы
- `clear: () => void` - очищение полей ввода

**IEvents**

Работа с событиями:
- `on<T extends object>: (event: EventName, callback: (data: T) => void) => void` - устанавливает обработчик на событие
- `emit<T extends object>: (event: string, data?: T) => void` - инициирует событие с данными
- `trigger<T extends object>: (event: string, context?: Partial<T>): (data: T) => void` - создает триггер, генерирующий событие при вызове

**ILarekAPI**

Получение данных с сервера
- `getProductList: () => Promise<IProduct[]>` - получение промиса с массивом товаров
- `postOrder: (order: TOrder) => Promise<TOrderSuccess>` - отправляет указанный заказ на сервер, возвращая промис с результатом

**Данные пользователя в форме заказа**

- `TPaymentMethod = 'cash' | 'card'` - способ оплаты
- `TOrderForm = { address: string }` -  поля ввода первой фомы
- `TContactsForm = { email: string; phone: string }'>` - пля ввода второй формы

**Данные для работы с сервером**
                               
- `ApiListResponse<T> = { total: number; items: T[]};` - тип получения данных
- `ApiPostMethods = 'POST' | 'PUT' | 'DELETE'` - используемые HTTP-методы
- `TOrder = TOrderForm & TContactsForm` - тип сформированного заказа для отправки на сервер
- `type TOrderReady = {	payment: string; address: string; email: string; phone: string; items: string[]; total: number; }` - тип данных заказа
- `TOrderSuccess = { id: string; total: number }` - тип успешного заказа

## Архитектура приложения

Код приложения разделен на слои согласно парадигме **MVP**: 
- *слой представления*. Отвечает за отображение данных на странице, 
- *слой данных*. Отвечает за хранение и изменение данных
- *презентер*. Отвечает за связь представления и данных.

Все свойства классов прописаны защищенными, что обеспечивает доступ к некоторым данным или функциональности только внутри класса и его наследников, но не извне. Это помогает инкапсулировать внутреннюю логику класса и предотвратить несанкционированный доступ к его внутренним данным.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. 
- `constructor(cdn: string, baseUrl: string, options: RequestInit = {})` - конструктор, используя переданные аргументы, инициирует свойства `baseUrl`(базовый адрес сервера) и `options`(глобальные настройки запросов) экземпляра класса.
- `cdn` - адрес для получения изображений товара
- `handleResponse<T>: (response: Response) => Promise<T>` - обрабатывает ответ сервера, возвращая промис с объектом ответа
- `get<T>(uri: string) => Promise<T>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') => Promise<T>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
- `_events: Map<EventName, Set<Subscriber>>` - структура данных, которая состоит из пар ключ-значение, где ключ (EventName) представляет собой имя события, а значение (Set<Subscriber>) - набор подписчиков, которые хотят получать уведомления об этом событии.
Методы, реализуемые классом, описаны интерфейсом `IEvents`:
- `on` - установка обработчика на событие
- `emit` - инициация события
- `trigger` - возвращает функцию, при вызове которой инициируется требуемое в параметрах событие   
Добавлены методы:
- `off: (eventName: EventName, callback: Subscriber) => void` - снятие обработчика с события
- `onAll: (callback: (event: EmitterEvent) => void) => void` - слушать все события
- `offAll: () => void` - сбросить все обработчики

#### Класс Component<T>
Абстрактный класс для создания компонентов разметки. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор - контейнер с типом HTMLElement.
Содержит набор часто используемых в слое отображения методов:
- `toggleClass: (element: HTMLElement, className: string, force?: boolean) => void` - переключение указанного класса
- `setText: (element: HTMLElement, value: unknown) => void` - установка указанного текстового содержимого в HTML-элемент
- `setDisabled: (element: HTMLElement, state: boolean) => void` - установка блокировки элемента
- `setHidden: (element: HTMLElement) => void` - скрытие указанного элемента
- `setVisible: (element: HTMLElement) => void` - возврат элементу видимости настранице
- `setImage: (element: HTMLImageElement, src: string, alt?: string) => void` - установка изображения с альтернативным текстом
- `render: (data?: Partial<T>) => HTMLElement` - получение корневого DOM-элемента. Отвечает за сохранение полученных в параметре данных в полях компонентов через их сеттеры.

### Слой данных

*Все классы слоя данных в конструктор получают экземпляр брокера событий.*

#### Класс Catalog
Класс для работы с каталогом товаров. Реализует интерфейс ICatalog:
- `_products: IProduct[] = []` - каталог товаров в виде массива
- `_selectedProductId: IProduct['id'] = null` - идентификатор товара
- `getProduct: (productId: string) => TProduct` - получение товара по его id
- `set products(products: IProduct[])` - располагает товары в каталоге
- `set selectedProd(productId: IProduct['id'])` - устанавливает id выбранному товару
При получении каталога с сервера создается событие с передачей всех товаров. Брокер инициирует монтирование карточек товаров в страницу.
При получении id выбранного товара, вызывается событие с инициацией передачи шаблона карточки товара в модальное окно и его открытие.

#### Класс Basket
Класс описывает логику работы с корзиной. Реализует интерфейс ICatalog:
- `_items: IProduct[] = []` - массив товаров, добавленных в корзину
- `addProduct: (item: IProduct) => void` - добавление товара в корзину
- `removeProduct(productId: IProduct['id'])` - удаление товара из корзины
- `clear: () => void` - очищение корзины
- `isInBasket: (productId: IProduct['id']) => boolean` - проверка наличия конкретного товара в корзине
- `getTotal: () => number` - получение общей суммы товаров в корзине
- `getCount: () => number` - получение количества товаров в корзине
- `isEmpty: () => boolean` - проверка на пустую корзину
- `get items: () => IProduct[]` - получение массива товаров, добавленных в корзину
- `get itemsIds: () => IProduct['id'][]` - получение id товаров, добавленных в корзину
При получении данных о добавленном/удаленном товаре вызывается событие с передачей id выбранного товара. Брокер инициирует ререндер корзины. При удалении товара дополнительно вызывается событие для закрытия модального окна в случае получения пложительного результата проверки корзины на пустоту.

#### Класс Form
Класс для работы с вводимыми пользователем данными. Реализует интерфейс IOrder:
- `_payment = 'card'` - выбор способа оплаты заказа (по умолчанию - card)
- `_address = ''` - адрес доставки
- `_email = ''` - электронная почта
- `_phone = ''` - номер телефона
- `updateOrderFields: (field: keyof TFields, value: string) => void` - обновление полей ввода первой формы
- `updateContactsFields: (field: keyof TFields, value: string) => void` - обновление полей ввода второй формы
- `checkValidityOrder: () => string | true` - проверка валидности полей первой формы
- `checkValidityContacts: () => string | true` - проверка валидности полей второй формы
- `clear: () => void` - очищение полей ввода
- `set payment: (method: TPaymentMethod) => void` - устанавливает значение в поле 'payment'
- `set address: (value: string) => void` - устанавливает значение в поле 'address'
- `set email: (value: string) => void` - устанавливает значение в поле 'email'
- `set phone: (value: string) => void` - устанавливает значение в поле 'phone'
- `get buyerData: () => Record<string, string>` - получение значений полей всех форм
При получении данных из полей ввода, они валидируются, в зависимости от результата вызывая то или иное событие. Брокер реагирует либо инициацией отображения этой ошибки и изменения статуса блокировки кнопки сабмита (в случае невалидности фомы), либо только изменением статуса блокировки кнопки сабмита.

### Слой представления

*Все классы представления отвечают за отображение внутри DOM-элемента передаваемых в него данных. Наследуются от базового класса Component<T>, используя его конструктор(принимает HTML-контейнер для расположения дочерних элементов) и методы. Так же в конструктор классы принимают экземпляр брокера событий.*

**ProductView**
Класс для вывода на эран карточки товара. В конструктор принимает шаблонный элемент.
Свойства класса представляют собой элементы разметки:
- `_id: string` - идентификатор товара (только для хранения, на странице не отображается)
- `_description: HTMLParagraphElement` - описание товара 
- `_image: HTMLImageElement` - изображение товара 
- `_title: HTMLHeadingElement` - название товара 
- `_category: HTMLSpanElement` - категория товара 
- `_price: HTMLSpanElement` - стоимость товара 
- `_button: HTMLButtonElement` - кнопка для добавления/удаления товара из корзины
- `get id: () => IProduct['id']` - получение id товара
- `set id: (id) => void` - установка значения в поле 'id'
- `set description: (value: string) => void` - установка значения в поле 'description'
- `set image: (value: string) => void` - установка значения в поле 'image'
- `set title: (value: string) => void` - установка значения в поле 'title'
- `set category: (value: string) => void` - установка значения в поле 'category'
- `set price: (value: number) => void` - установка значения в поле 'price'
- `set button: (state: boolean) => void` - установка действия при нажатии кнопки
Установлен слушатели клика по кноке в карточке товара. По клику на кнопку id товара передается в событие, брокер инициирует действие в зависимости от наначения кнопки.

#### ProductCatalogView
Класс наследует все свойства и метода класса ProductView. Установлен слушатель клика по карточке товара. Обрботчик передает id карточки в событие, брокер инициирует запись id в модель каталога. 

#### ProductFullView
Класс наследует все свойства и метода класса ProductView, изменяя шаблон отображения карточки товара.

#### ProductBasketView
Класс наследует все свойства и метода класса ProductView. Добавляет:
- `_index: HTMLSpanElement` - порядковый номер товара в корзине 
- `set index: (value: number) => void`- установка значения в поле 'index'
Переопределяет действие по клику на кнопку в карточке товара.
Установлен слушатель клика на кнопку удаления товара с вызовом события.

**CatalogView**
Класс выводит полученные с сервера товары на страницу. 
- `_products: HTMLElement[]` - массив карточек товаров
- `set products: (products: HTMLElement[]) => void` - монтирование карточек товаров в страницу

**ModalView**
Класс реализует модальное окно.
- `closeButton: HTMLButtonElement` - кнопка закрытия модального окна
- `_content: HTMLElement` - контент модального окна
- `open: () => void` - открытие модального окна
- `close: () => void` - закрытие модального окна
- `set content: (content: HTMLElement) => void` - монтирование контента в модальное окно
Установлены слушатели клика на кнопку закрытия модального окна и сам контейнер.

**BasketView**
Класс отображает корзину пользователя:
- `_items: HTMLUListElement`- список товаров 
- `_total: HTMLSpanElement`- общая стоимость товаров 
- `button: HTMLButtonElement`- кнопка перехода к оформлению заказа 
- `toggleButton: (state: boolean) => void` - переключение статуса активности кнопки
- `set items: (items: HTMLLIElement[]) => void` - располагает товары в список
- `set total: (value: number) => void` - выводит общую стоимость товаров
Установлен слушатель клика на кнопку оформления заказа. По клику создается событие, брокер инициирует передачу контента (формы заказа) в модальное окно.

**CartView**
Класс для отображения иконки корзины.
- `_counter: HTMLSpanElement` - счетчик товаров в корзине
- `set counter: (value: number) => void` выводит количество товаров в корзине на иконку
Установлен слушатель клика, по которому создается событие, брокер инициирует получение данных корзины и передачу контента (шаблона карточки товара) в модальное окно.

**FormView**
Класс для отображения форм заказа на странице. 
- `_button: HTMLButtonElement` - кнопка записи данных (заблокирована по умолчанию)
- `_error: HTMLSpanElement` - ошибки валидации 
- `set submit(state: boolean)` - изменение статуса блокировки кнопки
- `set error(value: string)` - установка значение в поле 'error'
Установлен слушатель сабмита формы с вызовом события, бокер инициирует передачу шаблона следующей формы в модальное окно.

#### OrderFormView
Класс отображения формы с выбором способа оплаты и вводом адреса покупателя.
- `_payCard: HTMLButtonElement` - кнопка оплаты картой 
- `_payCash: HTMLButtonElement`- кнопка оплаты наличными 
- `_addressField: HTMLInputElement` - адрес доставки 
- `togglePayment: (value: string) => void` - переключение активного класса кнопок
- `clear: () => void` - очищение полей ввода и ошибок валидации формы 
- `set address(value: string)` - установка значения в поле 'address'
Добавлены слушатели клика на кнопки оплаты с вызовом события, по которому брокер устанавливает выбранный способ оплаты в модель. Так же установлен слушатель ввода данных. Во время заполнения поля формы в брокер передается событие с данными этого поля для проверки на валидность и получения текста ошибки, если она есть. 

#### ContactsFormView
Класс отображения формы с вводом электронной почты и номера телефона. 
- `_emailInput: HTMLInputElement`- электронная почта 
- `_phoneInput: HTMLInputElement` - номер телефона
- `set email(value: string)` - установка значения в поле 'email'
- `set phone(value: string)` - установка значения в поле 'phone'
- `clear: () => void` - очищение полей ввода и ошибок валидации формы 
Установлен слушатель ввода данных. Во время заполнения полей формы в брокер передается событие с данными этих полей для проверки на валидность и получения текста ошибки, если она есть. 

**Success**
Класс выводит на экран сообщение об успешном заказе.
- `_message: HTMLParagraphElement` - сообщение об успешном заказе и списанной сумме
- `button: HTMLButtonElement` - кнопка подтверждения
- `set message: (total: number) => void` - установка текста успешного оформления заказа

**StateMachineView**
Класс используется для управления состояниями приложения (возможные состояния определены в перечислении StateView) в зависимости от входных данных или событий. В конструктор получает начальное состояние.
- `currentState: StateView` - текущее состояние
- `transitions: Partial<Record<StateView, Record<string, StateView>>>` - объект для хранения переходов между состояниями
- `addTransition: (fromState: StateView, toState: StateView, action: string) => void` - добавление перехода между двумя состояниями
- `transition: (action: string) => void` - переход из текущего в новое состояние
- `getCurrentState: () => StateView` - получение текущего состояния

## Взаимодействие компонентов
В файле index.ts cозданы экземпляры всех необходимых классов и настроена обработка событий. Здесь распложен код, выполняющий роль презентера и описывающий взаимодействие между слоями данных и представления за счет генерируемых событий и обработчиков этих событий. 

### Список событий в приложении:



| Событие             | Триггер                     | Реакция                 |
|:--------------------|:----------------------------|:------------------------|
|catalog:get|загрузка каталога товаров| вывод на экран карточек товаров, установка слушателей|
|product:select|клик по карточке товара|получение id товара, установка значения в поле модели|
|fullCard:change|установка значения в поле модели|проверка товара на наличие в корзине, установка значения кнопки, передача шаблона отображения товара в модальное окно |
|basket:addProduct|клик по кнопке добавления товара|получение данных товара по id, установка значений в поля модели
|basket:removeProduct| клик по кнопке удаления товара|получение данных товара по id, установка новых значений в поля модели|
|basket:removedAllProducts|положительная проверка на пустой массив товаров|закрытие модального окна|
|basket:change |установка значений в поля модели|передача шаблона отображения карточки в корзине, рендер корзины с передачей ее в качестве контента модального окна|
|basket:isEmpty|обнуление массива товаров в модели корзины|закрытие модального окна|
|basket:open|клик по иконке корзины| передача темплейта корзины в модальное окно с получением данных корзины, установка корзины в качестве контента модального окна, открытие модального окна|
|order:start|клик по кнопке оформления заказа|установка способа оплаты в модели, очищение полей ввода форм, передача формы в качестве контента в модальное окно, ререндер модльного окна|
|payment:select|выбор способа оплаты| запись значения в поле модели|
|form:error|проверка на валидность дынных отрицательная| вывод текста ошибки на экран|
|form:valid|проверка на валидность положительная|очищение ошибок, акивация кнопки сабмита|
|*Input:change|заполнение поля ввода формы|обновление данных в модели|
|form:next|клик по кнопке сабмита первой формы|передача второй формы в качестве контента в модальное окно|
|order:ready|клик по кнопке сабмита второй формы|формирование заказа и отправка его на сервер, очищение корзины и всех форм, передача шаблона и данных успешного заказа в модальное окно|
|order:success|клик по кнопке в сообщении об успешнсти заказа|закрытие модального окна|


