# **Floppy Filter**

Just another library to filter JavaScript objects, based on a simple and flexible pattern with support for negation.

[![Node Version](https://img.shields.io/node/v/floppy-filter.svg)](https://nodejs.org)
[![npm version](https://img.shields.io/npm/v/floppy-filter/latest.svg)](https://www.npmjs.com/package/floppy-filter)
[![Build Status](https://github.com/m-elbably/floppy-filter/workflows/floppy-filter/badge.svg)](https://github.com/m-elbably/floppy-filter/workflows/floppy-filter/badge.svg)
[![coverage status](https://img.shields.io/coveralls/github/m-elbably/floppy-filter.svg)](https://coveralls.io/github/m-elbably/floppy-filter)
[![License](https://img.shields.io/github/license/m-elbably/floppy-filter.svg)](https://raw.githubusercontent.com/m-elbably/floppy-filter/master/LICENSE)

## Installation
    npm install floppy-filter --save
## Features
- ***Wildcard Matching***: `*` can be used with `.` to select different paths within an object.
- ***Negation***: `!` can be used with `*` to allow all properties except negated paths within an object.
- ***Explicit***: Selecting `user.address` does not show address object and its nested properties but `user.address.city` will select `address` object with `city` property, or `user.address.*` to select `address` object and all its primitive properties

> **Primitive Properties**: Properties with values that are not Objects

## Usage

We will use this sample object to apply library functionalities

      const user = {
        "_id": "5f13c2e046d4e1b898cd25c5",
        "index": 0,
        "guid": "674cd798-87a8-44e7-9be1-d4ad9c50a923",
        "isActive": true,
        "balance": "$3,848.78",
        "picture": "http://placehold.it/32x32",
        "age": 35,
        "eyeColor": "blue",
        "name": {
          "first": "Callahan",
          "last": "Gilliam"
        },
        "address": {
          "country": "Philippines",
          "city": "Baliuag Nuevo",
          "street": "82 Roxbury Drive",
          "location": {
            "lat": 13.5201065,
            "lng": 123.1985807
          }
        },
        "company": "OLYMPIX",
        "email": "callahan.gilliam@olympix.info",
        "phone": "+1 (845) 441-3694",
        "about": "Ullamco irure est dolor non culpa consequat.",
        "registered": "Sunday, March 15, 2015 2:07 AM",
        "latitude": "-14.770193",
        "longitude": "54.884539",
        "tags": ["ullamco", "amet", "enim", "id", "fugiat"],
        "range": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        "friends": [
          {
            "id": 0,
            "name": "Corine Mcleod"
          },
          {
            "id": 1,
            "name": "Lauri Fields"
          },
          {
            "id": 2,
            "name": "Jami Cortez"
          }
        ],
        "greeting": "Hello, Callahan! You have 8 unread messages.",
        "favoriteFruit": "apple"
      }


## Select Subset

Select one or more properties

    filterObject(user, ['_id', 'guid']);
    // Output
    {
      "_id": "5f13c2e046d4e1b898cd25c5",
      "guid": "674cd798-87a8-44e7-9be1-d4ad9c50a923"
    }

Select from nested properties

    filterObject(user, ['_id', 'guid', 'address.city']);
    // Output
    {
      "_id": "5f13c2e046d4e1b898cd25c5",
      "guid": "674cd798-87a8-44e7-9be1-d4ad9c50a923",
      "address": {
        "city": "Baliuag Nuevo"
      }
    }


> We can select all nested properties using `*` operator, But this will only select first level of `address` object which contains only (`country`, `city`, `street`) properties, but not the `location` attribute as its an object not primitive.

Here is an example:

    filterObject(user, ['_id', 'guid', 'address.*']);
    // Output
    {
      "_id": "5f13c2e046d4e1b898cd25c5",
      "guid": "674cd798-87a8-44e7-9be1-d4ad9c50a923",
      "address": {
        "country": "Philippines",
        "city": "Baliuag Nuevo",
        "street": "82 Roxbury Drive"
      }
    }

To select all nested properties (including objects) in `address` object, We need to use `**` which will select all nested paths inside object

    filterObject(user, ['_id', 'guid', 'address.**']);
    // Output
    {
      "_id": "5f13c2e046d4e1b898cd25c5",
      "guid": "674cd798-87a8-44e7-9be1-d4ad9c50a923",
      "address": {
        "country": "Philippines",
        "city": "Baliuag Nuevo",
        "street": "82 Roxbury Drive",
        "location": {
          "lat": 13.5201065,
          "lng": 123.1985807
        }
      }
    }


## Select Subset from an Array

We can select at a specific index of an array using


- `array.i.attr` Select specific properties within specific item, Ex `user.friends.0.id`
- `array.i.*` Select whole item primitive properties (Without Objects) , Ex `user.friends.0.*`
- `array.i.**` Select whole item wit all nested properties, Ex `user.friends.0.**`


> Using `array.0` will not return the item at index `0`
> You must explicitly select specific attribute like `friends.0.id` , select all using `*` like `friends.0.*` or `friends.0.**`


    filterObject(user, ['_id', 'guid', 'friends.0.id']);
    // Output
    {
      "_id": "5f13c2e046d4e1b898cd25c5",
      "guid": "674cd798-87a8-44e7-9be1-d4ad9c50a923",
      "friends": [
        {
          "id": 0
        }
      ]
    }
    
    filterObject(user, ['_id', 'guid', 'friends.0.*']);
    // Output
    {
      "_id": "5f13c2e046d4e1b898cd25c5",
      "guid": "674cd798-87a8-44e7-9be1-d4ad9c50a923",
      "friends": [
        {
          "id": 0,
          "name": "Corine Mcleod"
        }
      ]
    }


## Negation

Select all properties, without `_id` and `guid` properties

    filterObject(user, ['*', '!_id', '!guid']);
    // Output
    {
        "index": 0,
        "isActive": true,
        "balance": "$3,848.78",
        "picture": "http://placehold.it/32x32",
        ...  
    }

Select all properties, without `address.country` property

    filterObject(user, ['*', '!address.country']);
    // Output
    {
        ...,
        "address": {
          "city": "Baliuag Nuevo",
          "street": "82 Roxbury Drive",
          "location": {
            "lat": 13.5201065,
            "lng": 123.1985807
          }
        },
        ...
    }

> Filter object with negation like `['*', '!address']` to filter out
> `address`  object will not work, you should explicitly specify inside
> `address` object, like using:
> 
> - `['*', '!address.country']` to filter out `country` property
> - `['*', '!address.*']` to filter out all primitive properties (`country`, `city`, `street`)
> - `['*', '!address.**']` to filter out the whole `address` object

Select all properties, but filter out `id` property from first object inside `friends` array

    filterObject(user, ['*', '!friends.0.id']);
    // Output
    {
        ...,
        "friends": [
          {
            "name": "Corine Mcleod"
          },
          {
            "id": 1,
            "name": "Lauri Fields"
          },
          {
            "id": 2,
            "name": "Jami Cortez"
          }
        ],
        ...  
    }

Select all properties, but filter out `id` property from all nested objects inside `friends` array

    filterObject(user, ['*', '!friends.*.id']);
    // Output
    {
        ...,
        "friends": [
          {
            "name": "Corine Mcleod"
          },
          {
            "name": "Lauri Fields"
          },
          {
            "name": "Jami Cortez"
          }
        ],
        ...  
    }

Select all properties, but filter out first object inside `friends` array

    filterObject(user, ['*', '!friends.0.*']);
    // Output
    {
        ...,
        "friends": [
          {
            "id": 1,
            "name": "Lauri Fields"
          },
          {
            "id": 2,
            "name": "Jami Cortez"
          }
        ],
        ...  
    }


## Interesting use cases

Combining `*`, selection patterns and negation patterns makes it very flexible to filter JavaScript objects

You can select all primitive properties using these filters `['*', '!**.**']`

    const user = {
        "name": "John",
        "age": 24,
        "address": {
          "country": "Indonesia",
          "city": "Gombong",
          "street": "81 Upham Lane",
          "location": {
            "lat": -7.6052823,
            "lng": 109.5151561
          }
        },
        "phones": ["+1 (881) 402-2942", "+1 (881) 402-2946"]
    };
    
    const filter = ['*', '!**.**'];
    const result = filterObject(user, filter);
    
    console.log(result);

The result:

    {
        "name": "John",
        "age": 24
    }

Or do the opposite and select only objects and ignore primitive properties using these filters `['*', '!*']` 

and the result will be:

    {
        "address": {
          "country": "Indonesia",
          "city": "Gombong",
          "street": "81 Upham Lane",
          "location": {
            "lat": -7.6052823,
            "lng": 109.5151561
          }
        },
        "phones": ["+1 (881) 402-2942", "+1 (881) 402-2946"]
    }


## Patterns
| **Pattern (Sample)** | **Description** |
|----------------------|-----------------|
| `*`                  | Select all properties in object, including all nested object, arrays (All depth levels, clone original object) | 
| `user.*`             | Inside `user` object, select all primitive properties (No Objects)                                             |
| `user.*.name`        | Inside `user` object, select "name" property within nested objects (first depth level)                         |
| `user.**`            | Inside `user` object, select all nested objects and arrays (All depth levels)                                  |
| `user.**.name`       | Inside `user` object, select all objects with "name" property (All depth levels)                               |
| `*.name`             | Select all objects with "name" property (first depth level) within root object                                 |
| `**.name`            | Select all objects with "name" property in all nested objects (All depth levels) within root object            |

> All previous patterns can be used with negation operator `!`

**License**
MIT
