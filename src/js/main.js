/** 
 * @author Abhishek Kumar
 * @license This work is licensed under a Creative Commons Attribution 4.0 International License.
 */

var nistush = function(e){
	console.log('main');

	var Card = function () {
		var cid,
			containers = {},
			controls = {},
			webservice = '',
			toggle = false;
		var getFormFieldHashMap = function (form) {
            var values = {};
            $.each(form.serializeArray(), function (i, field) {
                if (field.name.lastIndexOf('[]') < 0) {
                    values[field.name] = field.value;
                } else {
                    var fieldname = field.name.substr(0, field.name.lastIndexOf('[]'));
                    if (!values.hasOwnProperty(fieldname)) {
                        values[fieldname] = [];
                    }
                    values[fieldname].push(field.value);
                }
            });
            return values;
        }
        var getTabulatedData = function (data) {
        	var ilines = data.split('\n'), 
				olines = [];
			for(let i=0; i<ilines.length; i++) {
				let cells = ilines[i].split('|').join('</td><td>');
				olines.push('<td>' + cells + '</td>');
			}
			let output = '<table><tr>' + olines.join('</tr><tr>') + '</tr></table>';
			return output;
        }
        var getFilteredData = function (pattern, data) {
        	var output = data;
        	if(!!pattern) {
				var ilines = data.split('\n'), 
					olines = [];
				for(let i=0; i<ilines.length; i++) {
					if(ilines[i].indexOf(pattern) >= 0) {
						olines.push(ilines[i]);
					}
				}
				output = olines.join('\n');
			} 
			return output;
        }
		controls.flipper = function(e) {
			console.log('Card', cid, 'controls.flipper');
			if(toggle) {
				containers.input.removeClass('hide');
				containers.output.addClass('hide');
				toggle = false;
			} else {
				containers.input.addClass('hide');
				containers.output.removeClass('hide');
				toggle = true;
			}
		}
		controls.submit = function(e) {
			console.log('Card', cid, 'controls.submit');
			e.preventDefault();
			containers.inputMessage.html('Please wait ...').removeClass('hide');
			var values = getFormFieldHashMap(containers.input);
			$.ajax({
				url: webservice + values.filename,
				type: 'GET',
                dataType: 'text',
                data: {},
				success: function(result, textStatus, xOptions) {
					console.log('Card', cid, 'controls.submit, success:', result, textStatus, xOptions);
					containers.outputStatus.html('Loading complete!').removeClass('success failure').addClass('success');
					let filteredData = getFilteredData(values.filterlinewith, result)
					if (values.outputas == 'raw') {
						containers.outputResponse.html(filteredData);
					} else if (values.outputas == 'tabulated') {
						let tabulatedData = getTabulatedData(filteredData);
						containers.outputTabulate.html(tabulatedData);
					}
					containers.inputMessage.html('').addClass('hide');
					controls.flipper(e);
				},
				error: function(xOptions, textStatus, errorThrown) {
					console.log('Card', cid, 'controls.submit, failure:', xOptions, textStatus, errorThrown);
					containers.outputStatus.html(textStatus);
					containers.outputResponse.html(errorThrown);
					containers.inputMessage.html('').addClass('hide');
				}
			});
		}
		this.setWebserviceUrl = function (url) {
			webservice = url;
		}
		this.destroy = function () {
			console.log('Card', cid, 'destroy');
			containers.flipper.off('click', controls.flipper);
		}
		this.initialize = function(id) {
			cid = id;
			console.log('Card', cid, 'initialize');
			containers.self = $('#'+id);
			containers.flipper = containers.self.find('.flipper');
			containers.input = containers.self.find('.input');
			containers.inputMessage = containers.input.find('.message');
			containers.output = containers.self.find('.output');
			containers.outputResponse = containers.output.find('code');
			containers.outputTabulate = containers.output.find('.tabulate');
			containers.outputStatus = containers.output.find('.status');
			containers.submit = containers.self.find('button[type=submit]');

			containers.flipper.on('click', controls.flipper);
			containers.submit.on('click', controls.submit);			
		}
	}

	var cardCheckPassedArguments = new Card();
	cardCheckPassedArguments.setWebserviceUrl('/data/');
	cardCheckPassedArguments.initialize('CheckPassedArguments');

};

$(nistush);