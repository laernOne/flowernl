
window.FLOWER_PRODUCTS = [
  {
    id: 1,
    name: "Нідерландські тюльпани",
    category: "tulips",
    categoryName: "Тюльпани",
    origin: "Netherlands",
    price: 850,
    image: "img/product-1.svg",
    description: "Свіжі тюльпани з Нідерландів для подарункових букетів і сезонних композицій.",
    care: "Змінювати воду щодня, тримати подалі від прямих сонячних променів.",
    inStock: true,
    quantity: 28
  },
  {
    id: 2,
    name: "Червоні троянди Red Naomi",
    category: "roses",
    categoryName: "Троянди",
    origin: "Netherlands",
    price: 1450,
    image: "img/product-2.svg",
    description: "Преміальні червоні троянди з щільним бутоном і виразним ароматом.",
    care: "Оновлювати зріз під кутом, використовувати чисту прохолодну воду.",
    inStock: true,
    quantity: 18
  },
  {
    id: 3,
    name: "Рожеві півонії",
    category: "peonies",
    categoryName: "Півонії",
    origin: "Netherlands",
    price: 1850,
    image: "img/product-3.svg",
    description: "Сезонні півонії ніжного рожевого відтінку для подарунків і подій.",
    care: "Тримати у прохолодному місці, не ставити поруч із фруктами.",
    inStock: true,
    quantity: 12
  },
  {
    id: 4,
    name: "Гортензія біло-блакитна",
    category: "hydrangea",
    categoryName: "Гортензії",
    origin: "Netherlands",
    price: 980,
    image: "img/product-4.svg",
    description: "Велика гортензія для монобукетів і флористичних композицій.",
    care: "Потребує достатньої кількості води, бажано обприскувати суцвіття.",
    inStock: true,
    quantity: 15
  },
  {
    id: 5,
    name: "Весняний букет Amsterdam",
    category: "bouquets",
    categoryName: "Букети",
    origin: "Netherlands",
    price: 2350,
    image: "img/product-5.svg",
    description: "Букет з тюльпанів, троянд і сезонної зелені в нідерландській стилістиці.",
    care: "Зняти транспортне пакування, оновити зріз і поставити у вазу з водою.",
    inStock: true,
    quantity: 8
  },
  {
    id: 6,
    name: "Кімнатна рослина Monstera",
    category: "plants",
    categoryName: "Кімнатні рослини",
    origin: "Netherlands",
    price: 1650,
    image: "img/product-6.svg",
    description: "Декоративна кімнатна рослина для дому, офісу або подарунка.",
    care: "Поливати після підсихання верхнього шару ґрунту, уникати протягів.",
    inStock: true,
    quantity: 7
  },
  {
    id: 7,
    name: "Білі тюльпани White Dream",
    category: "tulips",
    categoryName: "Тюльпани",
    origin: "Netherlands",
    price: 920,
    image: "img/product-7.svg",
    description: "Лаконічні білі тюльпани для весільних композицій і мінімалістичних букетів.",
    care: "Ставити у високу вазу, не наливати надто багато води.",
    inStock: true,
    quantity: 20
  },
  {
    id: 8,
    name: "Садові троянди Juliet",
    category: "roses",
    categoryName: "Троянди",
    origin: "Netherlands",
    price: 2100,
    image: "img/product-8.svg",
    description: "Садові троянди з багатошаровим бутоном для преміальних композицій.",
    care: "Оновити зріз, прибрати нижнє листя, використовувати поживний розчин.",
    inStock: false,
    quantity: 0
  },
  {
    id: 9,
    name: "Преміальний мікс Delft",
    category: "bouquets",
    categoryName: "Букети",
    origin: "Netherlands",
    price: 2850,
    image: "img/product-9.svg",
    description: "Авторський букет із сезонних квітів, зелені та акцентних елементів.",
    care: "Зберігати у прохолоді, змінювати воду кожні 24 години.",
    inStock: true,
    quantity: 5
  },
  {
    id: 10,
    name: "Синя гортензія Blue Sky",
    category: "hydrangea",
    categoryName: "Гортензії",
    origin: "Netherlands",
    price: 1120,
    image: "img/product-10.svg",
    description: "Синя гортензія для виразних букетів, фотозон і подарункових композицій.",
    care: "Забезпечити багато води, уникати перегрівання.",
    inStock: true,
    quantity: 11
  },
  {
    id: 11,
    name: "Орхідея Phalaenopsis",
    category: "plants",
    categoryName: "Кімнатні рослини",
    origin: "Netherlands",
    price: 1320,
    image: "img/product-11.svg",
    description: "Квітуча орхідея в горщику, придатна для дому та офісного простору.",
    care: "Поливати помірно, тримати при розсіяному освітленні.",
    inStock: true,
    quantity: 9
  },
  {
    id: 12,
    name: "Коралові півонії Coral Charm",
    category: "peonies",
    categoryName: "Півонії",
    origin: "Netherlands",
    price: 1980,
    image: "img/product-12.svg",
    description: "Яскраві півонії коралового відтінку з виразною сезонною естетикою.",
    care: "Ставити у прохолодне місце, щоденно оновлювати воду.",
    inStock: true,
    quantity: 6
  }
];

window.FLOWER_CATEGORIES = [
  { id: "all", name: "Усі категорії" },
  { id: "tulips", name: "Тюльпани" },
  { id: "roses", name: "Троянди" },
  { id: "peonies", name: "Півонії" },
  { id: "hydrangea", name: "Гортензії" },
  { id: "bouquets", name: "Букети" },
  { id: "plants", name: "Кімнатні рослини" }
];

window.ORDER_STATUSES = ["Нове", "В обробці", "Передано в доставку", "Виконано", "Скасовано"];
