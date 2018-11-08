var expect = require('expect');
var {generateMessage, generateLocationMessage} = require ('./message')

describe('generate Message', () =>{
it('should generate correct message object', () => {

    var from = 'Greg';
    var text = 'Some Message';
    var message = generateMessage(from,text);
    
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({
        from,
        text
    });

});


});

describe('generate Location Message', () =>{
    it('should generate correct location object', () => {
    
        var from = 'Greg';
        var lat = '15';
        var lng = '19';
        var url = 'https://www.google.com/maps?q=15,19';
        var message = generateLocationMessage(from,lat,lng);
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from,
            url
        });
    
    });
    
    
    });