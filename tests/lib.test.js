const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');
describe('absolute', () => {
    it('should return a positive number if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });
    
    it('should return a positive number if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });
    
    it('should return 0 if input is positive', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', ()=> {
    it('should return the greeting message', () => {
        const result = lib.greet('Mosh');
        expect(result).toMatch(/Mosh/);
        expect(result).toContain('Mosh');
    });
});

describe('getCurrencies', () => {
    it('shoulf return supported currencies', () => {
        const result = lib.getCurrencies();

        //too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        //too specific
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');

        //Proper way
        expect(result).toContain('USD');
        expect(result).toContain('AUD');
        expect(result).toContain('USD');

        //Ideal way
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']))
    });
    
});

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = lib.getProduct(1);
       // expect(result).toEqual({id: 1, price: 10});
        expect(result).toMatchObject({id: 1, price: 10});
    });

    describe('resgisterUser', () => {
        it('should throw if username is falsy', () => {
            const args = [null, undefined, NaN, '', 0, false];
            args.forEach(a => {
                expect(() => {lib.registerUser(a)}).toThrow();
            });
        });

        it('should return a user object if valid username is passed', () => {
            const result = lib.registerUser('Mosh');
            expect(result).toMatchObject({username: 'Mosh'});
            expect(result.id).toBeGreaterThan(0);
        });
    });
});

describe('applyDiscount', () => {
    it('should apply 10% if customer has more than 10 points', () => {
        db.getCustomerSync = function(customerID) {
            console.log('Fake reading customer...');
            return {id: customerID, points: 20};
        }

        const order = {customerID: 1, totalPrice: 10};
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

describe('notifyCustomer', () => {
    it('should send an email to the customer', () => {
        db.getCustomerSync = jest.fn().mockReturnValue({email: 'a'});
        mail.send = jest.fn();

        lib.notifyCustomer({customerID: 1});

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0] [0]).toBe('a');
        expect(mail.send.mock.calls[0] [1]).toMatch(/order/);

    });
});