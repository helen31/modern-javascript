console.log('Topic: Iterators');
// Task 1
// RU: Написать функцию keyValueIterable(target),
//     которая на вход получает объект и возвращает итерируемый объект.
//     Итерируемый объект позволяет получить пары ключ/значение.
//     Выведите в консоль цвета из объекта colors.
// EN: Create a function keyValueIterable(target)
//     which takes an objects and returns iterable object.
//     Iterable object allows you to get key/value pairs.
//     Display in a console all colors from the object colors.

export function keyValueIterable(target) {
    if (typeof target[Symbol.iterator] === 'function') {
        console.log('it is iterable object!');
        return;
    }


    const keys = Object.keys(target);

    Object.defineProperty(target, Symbol.iterator, {
        value: function() {
            return {
                next() {
                    const done = keys.length === 0;
                    const key =  keys.shift();
                    return { value: [key, target[key]], done };
                }
            };

        },
        writable: false,
        enumerable: false,
    });

    console.log(target);

    return target;

}

const colors = {
  green: '#0e0',
  orange: '#f50',
  pink: '#e07'
};

// const itColors = keyValueIterable(colors);
// for (const [, color] of itColors) {
//   console.log(color);
// }


// Task 2
// RU: В коллекции хранятся все имена пользователей, которые присоединились к определенной группе телеграмм.
//     Булевый флаг указывает, является ли пользователь администратором группы.
//     Создайте итератор, который возвращает только имена администраторов.
// EN: The following collection store all the names of the user that have joined a particular telegram group. 
//     The boolean flag indicates whether a user is an administrator of the group.
//     Сreatereate an iterator that returns only the administrators' names.

const users = {
  anna: false,
  boris: true, // admin
  christina: false,
  dave: false,
  elena: false,
  felix: true,  // admin
};

function userInAGroupIterator(group) {
    // const adminNames = Object.keys(group).filter(key => group[key]);
    const keys = Object.keys(group);

//     group[Symbol.iterator] = function() {
//         return {
//             next() {
//                 const done = adminNames.length === 0;
//                 let name = adminNames.shift();
//
//                 return { value: name, done };
//             }
//         };
//     }
//     return group;

    group[Symbol.iterator] = function() {
        return {
            next() {
                const done = keys.length === 0; let key;

                function checkUser() {
                    key = keys.shift();

                    if (group[key] === false) {
                       checkUser();
                    }
                }
                checkUser();

                return { value: key, done };
            }
        };
    }
    return group;
}

// userInAGroupIterator(users);

// [...users].forEach(name => console.log(name)); // boris, felix


// Task 3
// RU: Написать функцию take(sequence, amount), которая из бесконечного итерируемого объекта random
//     вернет указаное количество элементов.
// EN: Create a function take(sequence, amount), which returns a specified amount of numbers
//     from iterable object random

const random = {
  [Symbol.iterator]: () => ({
    next: () => ({
      value: Math.random()
    })
  })
};

function take(sequence, amount) {
    let count = 0;
    return {
        [Symbol.iterator]: () => ({
            next: () => {
                const iterator = sequence[Symbol.iterator]();

                if (amount-- < 1) {
                    return { value: undefined, done: true };
                }
               return iterator.next();
            }
      })
    }
}

// const a = [...take(random, 3)];
// console.log(a);


// Task 4
// RU: Написать итерируемый итератор, который возвращает числа Фибоначи
//     Реализовать метод return для остановки итератора с помощью for-of + break
// EN: Create iterable iterator, which produces Fibonacci numbers
//     Implement method return, which allows you to stop iterator using for-of + break

const Fib = {
    prev: [0, 1],
    [Symbol.iterator]: function() { return this },

    next() {
        const value = this.prev[1] + this.prev[0];
        this.prev = [this.prev[1], value];
        return { value, done: false };
    },
    return(v) {
        return { value: v, done: true };
    }
};


// for (let v of Fib) {
//   console.log(v);
//   if (v > 50) break;
// }


// Task 5
// RU: Написать итератор для чисел, который позволит получать массивы последовательных целых элементов.
//     Например, [...-3] => [0, -1, -2, -3], [...3] => [0, 1, 2, 3]
// EN: Create iterator for numbers, which allows you to get arrays of sequential integers.
//     Example, [...-3] => [0, -1, -2, -3], [...3] => [0, 1, 2, 3]

// console.log([...-5]);
// console.log([...5]);

Number.prototype[Symbol.iterator] = function() {
    let start = 0;

    return {
        next: () => {
            if (this > 0 && start <= this) {
                return { value: start++, done: false };
            } else if (this < 0 && start >= this) {
                return { value: start--, done: false };
            }
            return { value: undefined, done: true };
        }
    };
}

// const v = [...3];
// console.log(v);
