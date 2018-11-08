var expect = require('expect');
var {generateMessage} = require ('./message')

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