export interface QuestionItem {
  id: number;
  letter: string;
  type: 'starts' | 'contains'; // 'starts' -> "Empieza por X", 'contains' -> "Contiene la Ñ"
  typeEs: string;
  typeHy: string;
  clueEs: string;
  clueHy: string;
  answerEs: string;
  answerHy: string;
  alternativeAnswers?: string[];
}

export const PASAPALABRA_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    letter: 'A',
    type: 'starts',
    typeEs: 'Empieza por A',
    typeHy: 'Սկսվում է A տառով',
    clueEs: 'Es un lugar al que vas cuando quieres viajar en avión. Allí hay pilotos, pasajeros y muchas maletas. ¿Qué es?',
    clueHy: 'Այն վայրն է, ուր գնում ես, երբ ցանկանում ես ինքնաթիռով ճանապարհորդել։ Այնտեղ կան օդաչուներ, ուղևորներ և բազմաթիվ ճամպրուկներ։ Ի՞նչ է դա։',
    answerEs: 'Aeropuerto',
    answerHy: 'Օդանավակայան',
    alternativeAnswers: ['el aeropuerto']
  },
  {
    id: 2,
    letter: 'B',
    type: 'starts',
    typeEs: 'Empieza por B',
    typeHy: 'Սկսվում է B տառով',
    clueEs: 'Es un lugar donde puedes encontrar miles de libros. La gente va allí para leer, estudiar o buscar información. ¿Qué es?',
    clueHy: 'Վայր է, որտեղ կարող ես գտնել հազարավոր գրքեր։ Մարդիկ այնտեղ գնում են կարդալու, սովորելու կամ տեղեկություններ փնտրելու համար։ Ի՞նչ է դա։',
    answerEs: 'Biblioteca',
    answerHy: 'Գրադարան',
    alternativeAnswers: ['la biblioteca']
  },
  {
    id: 3,
    letter: 'C',
    type: 'starts',
    typeEs: 'Empieza por C',
    typeHy: 'Սկսվում է C տառով',
    clueEs: 'Es un animal que puede cambiar de color y tiene una lengua muy larga para atrapar insectos. ¿Qué animal es?',
    clueHy: 'Կենդանի է, որը կարող է փոխել իր գույնը և ունի շատ երկար լեզու՝ միջատներ որսալու համար։ Ո՞ր կենդանին է։',
    answerEs: 'Camaleón',
    answerHy: 'Քամելեոն',
    alternativeAnswers: ['camaleon', 'el camaleon', 'el camaleón']
  },
  {
    id: 4,
    letter: 'D',
    type: 'starts',
    typeEs: 'Empieza por D',
    typeHy: 'Սկսվում է D տառով',
    clueEs: 'Es la primera comida del día. Algunas personas toman café, otras comen huevos, tostadas o cereales. ¿Qué es?',
    clueHy: 'Օրվա առաջին ուտելիքն է։ Ոմանք սուրճ են խմում, մյուսները ձու, տոստ կամ փաթիլներ են ուտում։ Ի՞նչ է դա։',
    answerEs: 'Desayuno',
    answerHy: 'Նախաճաշ',
    alternativeAnswers: ['el desayuno']
  },
  {
    id: 5,
    letter: 'E',
    type: 'starts',
    typeEs: 'Empieza por E',
    typeHy: 'Սկսվում է E տառով',
    clueEs: 'Es un objeto que te muestra tu propia imagen. Cuando sonríes delante de él, ves una sonrisa. ¿Qué es?',
    clueHy: 'Առարկա է, որը ցույց է տալիս քո սեփական արտացոլանքը։ Երբ նրա առջև ժպտում ես, ժպիտ ես տեսնում։ Ի՞նչ է դա։',
    answerEs: 'Espejo',
    answerHy: 'Հայելի',
    alternativeAnswers: ['el espejo']
  },
  {
    id: 6,
    letter: 'F',
    type: 'starts',
    typeEs: 'Empieza por F',
    typeHy: 'Սկսվում է F տառով',
    clueEs: 'Es una torre alta que normalmente está cerca del mar. Tiene una luz potente que ayuda a los barcos a orientarse por la noche. ¿Qué es?',
    clueHy: 'Բարձր աշտարակ է, որը սովորաբար գտնվում է ծովի մոտ։ Այն ունի ուժեղ լույս, որն օգնում է նավերին կողմնորոշվել գիշերը։ Ի՞նչ է դա։',
    answerEs: 'Faro',
    answerHy: 'Փարոս',
    alternativeAnswers: ['el faro']
  },
  {
    id: 7,
    letter: 'G',
    type: 'starts',
    typeEs: 'Empieza por G',
    typeHy: 'Սկսվում է G տառով',
    clueEs: 'Es un instrumento musical que tiene normalmente seis cuerdas. Puedes tocarlo con los dedos y acompañar canciones. ¿Qué es?',
    clueHy: 'Երաժշտական գործիք է, որը սովորաբար ունի վեց լար։ Կարող ես նվագել մատներով և երգեր նվագակցել։ Ի՞նչ է դա։',
    answerEs: 'Guitarra',
    answerHy: 'Կիթառ',
    alternativeAnswers: ['la guitarra']
  },
  {
    id: 8,
    letter: 'H',
    type: 'starts',
    typeEs: 'Empieza por H',
    typeHy: 'Սկսվում է H տառով',
    clueEs: 'Es un postre frío, normalmente dulce. Puede ser de chocolate, vainilla o fresa y se derrite cuando hace mucho calor. ¿Qué es?',
    clueHy: 'Սառը, սովորաբար քաղցր աղանդեր է։ Կարող է լինել շոկոլադի, վանիլի կամ ելակի համով և հալվում է, երբ շատ շոգ է։ Ի՞նչ է դա։',
    answerEs: 'Helado',
    answerHy: 'Պաղպաղակ',
    alternativeAnswers: ['el helado']
  },
  {
    id: 9,
    letter: 'I',
    type: 'starts',
    typeEs: 'Empieza por I',
    typeHy: 'Սկսվում է I տառով',
    clueEs: 'Es un objeto que atrae algunos metales, especialmente el hierro. Puedes encontrar pequeños ejemplos en la puerta del frigorífico. ¿Qué es?',
    clueHy: 'Առարկա է, որը ձգում է որոշ մետաղներ, հատկապես երկաթը։ Դրա փոքր օրինակները կարող ես գտնել սառնարանի դռան վրա։ Ի՞նչ է դա։',
    answerEs: 'Imán',
    answerHy: 'Մագնիս',
    alternativeAnswers: ['iman', 'el iman', 'el imán']
  },
  {
    id: 10,
    letter: 'J',
    type: 'starts',
    typeEs: 'Empieza por J',
    typeHy: 'Սկսվում է J տառով',
    clueEs: 'Es un animal africano muy alto. Tiene el cuello largo, manchas en el cuerpo y puede alcanzar las hojas de los árboles. ¿Qué animal es?',
    clueHy: 'Աֆրիկյան շատ բարձրահասակ կենդանի է։ Ունի երկար պարանոց, մարմնի վրա բծեր և կարող է հասնել ծառերի տերևներին։ Ո՞ր կենդանին է։',
    answerEs: 'Jirafa',
    answerHy: 'Ընձուղտ',
    alternativeAnswers: ['la jirafa']
  },
  {
    id: 11,
    letter: 'K',
    type: 'starts',
    typeEs: 'Empieza por K',
    typeHy: 'Սկսվում է K տառով',
    clueEs: 'Es una fruta pequeña, marrón por fuera y normalmente verde por dentro. Tiene muchas semillas negras y un sabor entre dulce y ácido. ¿Qué fruta es?',
    clueHy: 'Փոքր միրգ է, որը դրսից շագանակագույն է, իսկ ներսից սովորաբար կանաչ։ Ունի բազմաթիվ սև սերմեր և քաղցրաթթու համ։ Ո՞ր միրգն է։',
    answerEs: 'Kiwi',
    answerHy: 'Կիվի',
    alternativeAnswers: ['el kiwi']
  },
  {
    id: 12,
    letter: 'L',
    type: 'starts',
    typeEs: 'Empieza por L',
    typeHy: 'Սկսվում է L տառով',
    clueEs: 'Es el satélite natural de la Tierra. Podemos verlo en el cielo por la noche y a veces también durante el día. ¿Qué es?',
    clueHy: 'Երկրի բնական արբանյակն է։ Այն կարող ենք տեսնել երկնքում գիշերը, իսկ երբեմն նաև ցերեկը։ Ի՞նչ է դա։',
    answerEs: 'Luna',
    answerHy: 'Լուսին',
    alternativeAnswers: ['la luna']
  },
  {
    id: 13,
    letter: 'M',
    type: 'starts',
    typeEs: 'Empieza por M',
    typeHy: 'Սկսվում է M տառով',
    clueEs: 'Es un objeto que muestra países, ciudades, carreteras y ríos. Lo utilizamos para encontrar lugares o planificar viajes. ¿Qué es?',
    clueHy: 'Առարկա է, որը ցույց է տալիս երկրները, քաղաքները, ճանապարհներն ու գետերը։ Այն օգտագործում ենք վայրեր գտնելու կամ ճանապարհորդություններ պլանավորելու համար։ Ի՞նչ է դա։',
    answerEs: 'Mapa',
    answerHy: 'Քարտեզ',
    alternativeAnswers: ['el mapa']
  },
  {
    id: 14,
    letter: 'N',
    type: 'starts',
    typeEs: 'Empieza por N',
    typeHy: 'Սկսվում է N տառով',
    clueEs: 'Es algo que vemos en el cielo. Puede ser blanca, gris o muy oscura. Algunas veces trae lluvia o nieve. ¿Qué es?',
    clueHy: 'Մի բան է, որը տեսնում ենք երկնքում։ Կարող է լինել սպիտակ, մոխրագույն կամ շատ մուգ։ Երբեմն անձրև կամ ձյուն է բերում։ Ի՞նչ է դա։',
    answerEs: 'Nube',
    answerHy: 'Ամպ',
    alternativeAnswers: ['la nube']
  },
  {
    id: 15,
    letter: 'Ñ',
    type: 'contains',
    typeEs: 'Contiene la Ñ',
    typeHy: 'Պարունակում է Ñ տառը',
    clueEs: 'Es una gran elevación natural del terreno. Algunas tienen nieve en la cima y muchas personas disfrutan subiéndolas. ¿Qué es?',
    clueHy: 'Երկրի մակերևույթի բնական մեծ բարձրություն է։ Դրանցից որոշների գագաթին ձյուն կա, և շատ մարդիկ սիրում են բարձրանալ դրանց վրա։ Ի՞նչ է դա։',
    answerEs: 'Montaña',
    answerHy: 'Լեռ',
    alternativeAnswers: ['montana', 'la montana', 'la montaña']
  },
  {
    id: 16,
    letter: 'O',
    type: 'starts',
    typeEs: 'Empieza por O',
    typeHy: 'Սկսվում է O տառով',
    clueEs: 'Es una máquina electrónica que utilizamos para estudiar, trabajar, jugar y navegar por Internet. Tiene teclado y pantalla. ¿Qué es?',
    clueHy: 'Էլեկտրոնային սարք է, որն օգտագործում ենք սովորելու, աշխատելու, խաղալու և համացանցից օգտվելու համար։ Ունի ստեղնաշար և էկրան։ Ի՞նչ է դա։',
    answerEs: 'Ordenador',
    answerHy: 'Համակարգիչ',
    alternativeAnswers: ['el ordenador', 'computadora', 'la computadora']
  },
  {
    id: 17,
    letter: 'P',
    type: 'starts',
    typeEs: 'Empieza por P',
    typeHy: 'Սկսվում է P տառով',
    clueEs: 'En un equipo de fútbol, es el jugador que protege la portería. Puede utilizar las manos dentro de su propia área de penalti. ¿Quién es?',
    clueHy: 'Ֆուտբոլային թիմում այն խաղացողն է, որը պաշտպանում է դարպասը։ Իր թիմի տուգանային հրապարակում կարող է օգտագործել ձեռքերը։ Ո՞վ է։',
    answerEs: 'Portero',
    answerHy: 'Դարպասապահ',
    alternativeAnswers: ['el portero', 'arquero', 'el arquero', 'guardameta']
  },
  {
    id: 18,
    letter: 'Q',
    type: 'starts',
    typeEs: 'Empieza por Q',
    typeHy: 'Սկսվում է Q տառով',
    clueEs: 'Es un alimento que se prepara con leche. Puede ser blando o duro, y se utiliza mucho en pizzas, bocadillos y ensaladas. ¿Qué es?',
    clueHy: 'Սննդամթերք է, որը պատրաստվում է կաթից։ Կարող է լինել փափուկ կամ պինդ և հաճախ օգտագործվում է պիցցաների, սենդվիչների ու աղցանների մեջ։ Ի՞նչ է դա։',
    answerEs: 'Queso',
    answerHy: 'Պանիր',
    alternativeAnswers: ['el queso']
  },
  {
    id: 19,
    letter: 'R',
    type: 'starts',
    typeEs: 'Empieza por R',
    typeHy: 'Սկսվում է R տառով',
    clueEs: 'Es un objeto que nos ayuda a saber qué hora es. Puede estar en una pared, sobre una mesa o en la muñeca. ¿Qué es?',
    clueHy: 'Առարկա է, որն օգնում է իմանալ ժամը։ Կարող է լինել պատին, սեղանի վրա կամ դաստակին։ Ի՞նչ է դա։',
    answerEs: 'Reloj',
    answerHy: 'Ժամացույց',
    alternativeAnswers: ['el reloj']
  },
  {
    id: 20,
    letter: 'S',
    type: 'starts',
    typeEs: 'Empieza por S',
    typeHy: 'Սկսվում է S տառով',
    clueEs: 'Es un aparato que regula el tráfico. Tiene normalmente tres colores: rojo para parar, amarillo para tener precaución y verde para avanzar. ¿Qué es?',
    clueHy: 'Սարք է, որը կարգավորում է երթևեկությունը։ Սովորաբար ունի երեք գույն՝ կարմիր՝ կանգնելու, դեղին՝ զգույշ լինելու, կանաչ՝ առաջ շարժվելու համար։ Ի՞նչ է դա։',
    answerEs: 'Semáforo',
    answerHy: 'Լուսացույց',
    alternativeAnswers: ['semaforo', 'el semaforo', 'el semáforo']
  },
  {
    id: 21,
    letter: 'T',
    type: 'starts',
    typeEs: 'Empieza por T',
    typeHy: 'Սկսվում է T տառով',
    clueEs: 'Es un instrumento que permite observar objetos muy lejanos, como la Luna, los planetas y las estrellas. ¿Qué es?',
    clueHy: 'Գործիք է, որը թույլ է տալիս դիտել շատ հեռու գտնվող օբյեկտներ, օրինակ՝ Լուսինը, մոլորակներն ու աստղերը։ Ի՞նչ է դա։',
    answerEs: 'Telescopio',
    answerHy: 'Աստղադիտակ',
    alternativeAnswers: ['el telescopio']
  },
  {
    id: 22,
    letter: 'U',
    type: 'starts',
    typeEs: 'Empieza por U',
    typeHy: 'Սկսվում է U տառով',
    clueEs: 'Es todo lo que existe: las galaxias, las estrellas, los planetas, la materia, el espacio y el tiempo. ¿Qué es?',
    clueHy: 'Այն ամենն է, ինչ գոյություն ունի՝ գալակտիկաները, աստղերը, մոլորակները, նյութը, տարածությունն ու ժամանակը։ Ի՞նչ է դա։',
    answerEs: 'Universo',
    answerHy: 'Տիեզերք',
    alternativeAnswers: ['el universo']
  },
  {
    id: 23,
    letter: 'V',
    type: 'starts',
    typeEs: 'Empieza por V',
    typeHy: 'Սկսվում է V տառով',
    clueEs: 'Es una montaña que puede expulsar lava, gases y cenizas desde su interior. Algunas están activas y otras llevan muchos años sin entrar en erupción. ¿Qué es?',
    clueHy: 'Լեռ է, որի ներսից կարող են դուրս գալ լավա, գազեր և մոխիր։ Դրանցից որոշները ակտիվ են, իսկ մյուսները երկար տարիներ չեն ժայթքել։ Ի՞նչ է դա։',
    answerEs: 'Volcán',
    answerHy: 'Հրաբուխ',
    alternativeAnswers: ['volcan', 'el volcan', 'el volcán']
  },
  {
    id: 24,
    letter: 'W',
    type: 'starts',
    typeEs: 'Empieza por W',
    typeHy: 'Սկսվում է W տառով',
    clueEs: 'Es una tecnología que permite conectar dispositivos a Internet sin utilizar cables de red. La usamos mucho en casa, en los hoteles y en las cafeterías. ¿Qué es?',
    clueHy: 'Տեխնոլոգիա է, որը թույլ է տալիս սարքերը միացնել համացանցին առանց ցանցային լարերի։ Այն հաճախ օգտագործում ենք տանը, հյուրանոցներում և սրճարաններում։ Ի՞նչ է դա։',
    answerEs: 'Wifi',
    answerHy: 'Անլար ինտերնետ կապ',
    alternativeAnswers: ['wi-fi', 'el wifi', 'el wi-fi', 'wireless']
  },
  {
    id: 25,
    letter: 'X',
    type: 'starts',
    typeEs: 'Empieza por X',
    typeHy: 'Սկսվում է X տառով',
    clueEs: 'Es un instrumento musical de percusión que tiene láminas de diferentes tamaños. Para tocarlo, se golpean las láminas con unas baquetas. ¿Qué es?',
    clueHy: 'Հարվածային երաժշտական գործիք է, որն ունի տարբեր չափերի թիթեղներ։ Այն նվագելու համար թիթեղներին հարվածում են հատուկ փայտիկներով։ Ի՞նչ է դա։',
    answerEs: 'Xilófono',
    answerHy: 'Քսիլոֆոն',
    alternativeAnswers: ['xilofono', 'el xilofono', 'el xilófono']
  },
  {
    id: 26,
    letter: 'Y',
    type: 'starts',
    typeEs: 'Empieza por Y',
    typeHy: 'Սկսվում է Y տառով',
    clueEs: 'Es una embarcación que normalmente se utiliza para pasear, viajar o disfrutar del mar. Algunas son pequeñas y otras son muy lujosas. ¿Qué es?',
    clueHy: 'Ջրային փոխադրամիջոց է, որը սովորաբար օգտագործվում է զբոսնելու, ճանապարհորդելու կամ ծովում հանգստանալու համար։ Դրանցից որոշները փոքր են, իսկ մյուսները՝ շատ շքեղ։ Ի՞նչ է դա։',
    answerEs: 'Yate',
    answerHy: 'Զբոսանավ',
    alternativeAnswers: ['el yate']
  },
  {
    id: 27,
    letter: 'Z',
    type: 'starts',
    typeEs: 'Empieza por Z',
    typeHy: 'Սկսվում է Z տառով',
    clueEs: 'Es un animal salvaje que se parece a un perro, tiene el hocico puntiagudo y una cola larga y peluda. En muchos cuentos aparece como un animal muy astuto. ¿Qué animal es?',
    clueHy: 'Վայրի կենդանի է, որը նման է շան, ունի սրածայր դունչ և երկար, մորթոտ պոչ։ Շատ հեքիաթներում ներկայացվում է որպես շատ խորամանկ կենդանի։ Ո՞ր կենդանին է։',
    answerEs: 'Zorro',
    answerHy: 'Աղվես',
    alternativeAnswers: ['el zorro']
  }
];

export function normalizeSpanish(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents like á, é, í, ó, ú
    .replace(/^[¿?¡!.,;:"]+|[¿?¡!.,;:"]+$/g, '');
}

export function checkAnswerMatch(userAnswer: string, item: QuestionItem): boolean {
  const normUser = normalizeSpanish(userAnswer);
  if (!normUser) return false;

  const validAnswers = [item.answerEs, ...(item.alternativeAnswers || [])];
  return validAnswers.some(ans => normalizeSpanish(ans) === normUser);
}
