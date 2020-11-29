const chai = require('chai');
const { filterObject, filterObjects } = require('../src/index');
const objects = require('./data');

const { expect } = chai;
const object = objects[0];

describe('Test object filtering (whole set)', () => {
  it('Should return a new object with 22 properties', async () => {
    const fields = ['*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object');
    expect(Object.keys(result)).to.have.lengthOf(22);
  });
});

describe('Test object filtering (subset)', () => {
  it('Should return a new object with 2 properties', async () => {
    const fields = ['_id', 'guid'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.include.all.keys(...fields);
    expect(Object.keys(result)).to.have.lengthOf(fields.length);
  });

  it('Should return a new object with 3 properties, and "address" object only includes "city" property', async () => {
    const fields = ['_id', 'guid', 'address.city'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('address')
      .with.own.property('city');

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.address)).to.have.lengthOf(1);
  });

  it('Should return a new object with 3 properties, and "address" object includes ["county", "city", "street"] properties', async () => {
    const fields = ['_id', 'guid', 'address.*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('address')
      .that.include.all.keys('country', 'city', 'street');

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.address)).to.have.lengthOf(3);
  });

  it('Should return a new object with 3 properties, and "address" object includes ["county", "city", "street", "location"] properties', async () => {
    const fields = ['_id', 'guid', 'address.**'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('address')
      .that.include.all.keys('country', 'city', 'street', 'location');

    expect(result.address.location)
      .to.include.all.keys('lat', 'lng');

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.address)).to.have.lengthOf(4);
  });

  it('Should return a new object with 3 properties, and "friends" array should have only first item with only "id" property', async () => {
    const fields = ['_id', 'guid', 'friends.0.id'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('friends')
      .and.to.have.lengthOf(1);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.friends[0])).to.have.lengthOf(1);
    expect(result.friends[0]).to.have.own.property('id');
  });

  it('Should return a new object with 3 properties, and "friends" array should have only first item with all primitive properties (without objects)', async () => {
    const fields = ['_id', 'guid', 'friends.0.*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('friends')
      .and.to.have.lengthOf(1);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.friends[0])).to.have.lengthOf(2);
    expect(result.friends[0]).to.include.all.keys(['id', 'name']);
  });

  it('Should return a new object with 3 properties, and "friends" array should have only first item with all nested properties', async () => {
    const fields = ['_id', 'guid', 'friends.0.**'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('friends')
      .and.to.have.lengthOf(1);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.friends[0])).to.have.lengthOf(3);
    expect(result.friends[0]).to.include.all.keys(['id', 'name', 'details']);
    expect(result.friends[0].details).to.include.all.keys(['age', 'phone']);
  });

  it('Should return a new object with 3 properties, and "friends" array should have 3 items with only "id" property', async () => {
    const fields = ['_id', 'guid', 'friends.*.id'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('friends')
      .and.to.have.lengthOf(3);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.friends[0])).to.have.lengthOf(1);
    expect(result.friends[0]).to.include.all.keys(['id']);
  });

  it('Should return a new object with 3 properties, and "friends" array should have 3 items with all primitive property (without objects)', async () => {
    const fields = ['_id', 'guid', 'friends.*.*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('friends')
      .and.to.have.lengthOf(3);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.friends[0])).to.have.lengthOf(2);
    expect(result.friends[0]).to.include.all.keys(['id', 'name']);
  });

  it('Should return a new object with 3 properties, and "friends" array should have 3 items with all nested properties', async () => {
    const fields = ['_id', 'guid', 'friends.**'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('friends')
      .and.to.have.lengthOf(3);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.friends[0])).to.have.lengthOf(3);
    expect(result.friends[0]).to.include.all.keys(['id', 'name', 'details']);
    expect(result.friends[0].details).to.include.all.keys(['age', 'phone']);
  });

  it('Should return a new object with 3 properties, and "name" object with "first" property', async () => {
    const fields = ['_id', 'guid', '*.first'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('name')
      .and.to.include.all.keys(['first']);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.name)).to.have.lengthOf(1);
  });

  it('Should return a new object with 3 properties, and "friends" array with 3 items with only "name" property', async () => {
    const fields = ['_id', 'guid', '**.name'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('friends')
      .and.to.have.lengthOf(3);

    expect(Object.keys(result)).to.have.lengthOf(fields.length);
    expect(Object.keys(result.friends[0])).to.have.lengthOf(1);
    expect(result.friends[0]).to.have.own.property('name');
  });
});

describe('Test object filtering (negation)', () => {
  it('Should return a new empty object', async () => {
    const fields = ['!guid'];
    const result = filterObject(object, fields);

    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.an('object').that.is.empty;
  });

  it('Should return a new object without "guid" property', async () => {
    const fields = ['*', '!guid'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.not.have.property('guid');
  });

  it('Should return a new object with "address" property', async () => {
    const fields = ['*', '!address'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('address');
  });

  it('Should return a new object without "address.county" property', async () => {
    const fields = ['*', '!address.country'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('address')
      .and.not.have.property('country');
  });

  it('Should return a new object with only "address.location" property', async () => {
    const fields = ['*', '!address.*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.own.property('address')
      .and.not.include.all.keys(['country', 'city', 'street']);

    expect(result).to.have.own.property('address')
      .and.own.property('location');
  });

  it('Should return a new object without "address" property', async () => {
    const fields = ['*', '!address.**'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.not.have.own.property('address');
  });

  it('Should return a new object with all properties and "address" property includes only "country"', async () => {
    const fields = ['*', '!address.**', 'address.country'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.have.own.property('address')
      .have.own.property('country');
    expect(Object.keys(result.address)).to.have.lengthOf(1);
  });

  it('Should return a new object without "name" property in all nested levels, but not the root level (name should not be object or array)', async () => {
    const fields = ['*', '!**.name'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object');
    expect(result.friends[0]).to.not.have.own.property('name');
  });

  it('Should return a new object without "range" property', async () => {
    const fields = ['*', '!range.*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.not.have.own.property('range');
  });

  it('Should return a new object with "friends" array item 0 includes only complex objects or arrays', async () => {
    const fields = ['*', '!friends.0.*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.have.own.property('friends');
    expect(result.friends[0]).to.have.own.property('details');
    expect(Object.keys(result.friends[0])).to.have.lengthOf(1);
  });

  it('Should return a new object with "friends" with first item undefined', async () => {
    const fields = ['*', '!friends.0.**'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.have.own.property('friends');
    expect(result.friends[0]).to.be.equal(undefined);
  });

  it('Should return a new object with only primitive properties (not an object)', async () => {
    const fields = ['*', '!**.**'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.not.include.all.keys(['name', 'address', 'tags', 'range', 'friends']);
  });

  it('Should return a new object with only objects', async () => {
    const fields = ['*', '!*'];
    const result = filterObject(object, fields);

    expect(result).to.be.an('object')
      .and.include.all.keys(['name', 'address', 'tags', 'range', 'friends']);
    expect(Object.keys(result)).to.have.lengthOf(5);
  });

  it('Should return a new empty object', async () => {
    const fields = ['*', '!**'];
    const result = filterObject(object, fields);
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.an('object').that.is.empty;
  });
});

describe('Test bulk objects filtering', () => {
  it('Should return a new object with 22 properties', async () => {
    const fields = ['_id', 'guid'];
    const result = filterObjects(objects, fields);

    expect(result).to.be.an('array')
      .and.to.have.length(9);

    expect(result[0]).to.include.all.keys(...fields);
    expect(Object.keys(result[0])).to.have.lengthOf(fields.length);
  });
});
