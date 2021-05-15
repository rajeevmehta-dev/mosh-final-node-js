
const lib = require('../lib');
const exer=require('../exercise1');

describe('absolute/return number- +ve,-ve,0', () => {

    it('should return a +ve number when passed positive number', () => {

        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('should return a +ve number when passed negative number', () => {

        const result = lib.absolute(-1);

        expect(result).toBe(1);
    });

    it('should return a 0 when passed 0', () => {

        const result = lib.absolute(0);

        expect(result).toBe(0);
    });
});

describe('Greet/test string', () => {

    it('should return the passed Name', () => {

        const result = lib.greet('Adesh');
        // expect(result).toBe('Welcome Adesh'); Or
        // expect(result).toMatch(/Adesh/);  Or
        expect(result).toContain('Adesh');
    });
});

describe('Arrays/getCurrencies', () => {

    it('Should contain supported currencies', () => {

        const result = lib.getCurrencies();
        // proper way
        // expect(result).toContain('USD');
        // expect(result).toContain('AUD');
        // expect(result).toContain('EUR');
        //Or

        // ideal way
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));
    });
});

describe('Objects/getProduct', () => {
    it('Should return the given ID with product', () => {

        const result = lib.getProduct(3);
        // expect(result).toEqual({id:3,price:10}); toBe matches the reference of the object,so
        // it wants even the memory to be same, so it fails.

        //  expect(result).toEqual({ id: 3, price: 10 }); // checks only for values, not reference,
        // but will fail if even one property is missed

        expect(result).toMatchObject({id:3,price:10});
    });
});

describe('Register User',()=>{

    it('Should throw error because of falsy value',()=>{
        const args=[null,'',undefined,false,NaN,0];
        args.forEach(a=>{
            // passing all falsy values one by one, to check all the falsy values return error
            expect(()=>{registerUser(a)}).toThrow();
// WHENEVER WE NEED TO CHECK THROW ERROR, WE USE ARROW FUNCTION DIRECTLY IN EXCEPT
        });
        
    });

    it('should return Username if valid username is passed',()=>{
        const result=lib.registerUser('adesh');
        expect(result).toMatchObject({username:'adesh'});
        expect(result.id).toBeGreaterThan(0);
    });
});


//  EXERCISE
describe('FizzBuzz',()=>{

    it('should throw error on non-number input',()=>{
    expect(()=>{exer.fizzBuzz('rr')}).toThrow();
    });

    it('should return FizBuzz as 15 is divisible by 3 and 5 both',()=>{
        const result=exer.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });

    it('should return fizz as 18 is only divisible by 3',()=>{

        const result=exer.fizzBuzz(18);
        expect(result).toBe('Fizz');
    });
    it('should return Buzz as 10 is only divisible by 5',()=>{

        const result=exer.fizzBuzz(10);
        expect(result).toBe('Buzz');
    });
    it('should return 14 as 14 is not divisible by 3 or 5',()=>{

        const result=exer.fizzBuzz(14);
        expect(result).toBe(14);
    });

    
});