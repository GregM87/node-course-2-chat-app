const expect = require('expect');

const {isRealString} = require('./validation');


describe ('is Real String', () => {

    it('should reject non-string value', () =>{

        var res= isRealString(98);
        expect(res).toBe(false);
    });

    it('should reject value with only spaces', () =>{

        var res= isRealString('  ');
        expect(res).toBe(false);
    });

    it('should reject value with non-space characters', () =>{

        var res= isRealString(' gregpr ');
        expect(res).toBe(true);
    });

})