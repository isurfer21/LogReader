/** 
 * @author Abhishek Kumar
 * @license This work is licensed under a Creative Commons Attribution 4.0 International License.
 */

var nistush = function(e) {
    console.log('main');

    var Card = function() {
        var containers = {},
            controls = {};
        var getTabulatedData = function(data) {
            var ilines = data.split('\n'),
                olines = [];
            for (let i = 0; i < ilines.length; i++) {
                let cells = ilines[i].split('|').join('</td><td>');
                olines.push('<td>' + cells + '</td>');
            }
            let output = '<table><tr>' + olines.join('</tr><tr>') + '</tr></table>';
            return output;
        }
        var getFilteredData = function(pattern, data) {
            var output = data;
            if (!!pattern) {
                var ilines = data.split('\n'),
                    olines = [];
                for (let i = 0; i < ilines.length; i++) {
                    if (ilines[i].indexOf(pattern) >= 0) {
                        olines.push(ilines[i]);
                    }
                }
                output = olines.join('\n');
            }
            return output;
        }

        controls.handleFileSelect = function(evt) {
            console.log('controls.handleFileSelect', evt);
            let files = evt.target.files;
            if (files.length > 0) {
                var fileExtension = /\.(log|txt)$/gi;
                var fileTobeRead = files[0];
                if (fileTobeRead.name.match(fileExtension)) {
                    var fileReader = new FileReader();
                    fileReader.onload = function(e) {
                        let filteredData = getFilteredData(containers.filterStr.val(), fileReader.result);
                        containers.outputResponse.html(filteredData);
                        let tabulatedData = getTabulatedData(filteredData);
                        containers.outputTabulate.html(tabulatedData);
                    }
                    fileReader.readAsText(fileTobeRead);
                    containers.output.removeClass('hide');
                } else {
                    alert("Please select log file");
                }
            }
        }
        controls.handleOutputFormat = function(e) {
            console.log('controls.handleOutputFormat', e);
            let outputFmt = e.target.value;
            if (outputFmt == "raw") {
                containers.outputResponse.removeClass('hide');
                containers.outputTabulate.addClass('hide');
            } else {
                containers.outputResponse.addClass('hide');
                containers.outputTabulate.removeClass('hide');
            }
        }
        controls.resetAtDefaultState = function(e) {
            containers.outputResponse.html('');
            containers.outputTabulate.html('');
            containers.output.addClass('hide');
            containers.fmtRaw.trigger('click');
        }
        controls.showAbout = function(e) {
            containers.appAbout.removeClass('hide');
        }
        controls.hideAbout = function(e) {
            containers.appAbout.addClass('hide');
        }

        this.destroy = function() {
            console.log('Card', cid, 'destroy');
            containers.fileRef.off('change', controls.handleFileSelect);
            containers.fmtRaw.off('click', controls.handleOutputFormat);
            containers.fmtTable.off('click', controls.handleOutputFormat);
        }
        this.initialize = function() {
            console.log('Card initialized');
            containers.appLogo = $('.app-logo');

            containers.appAbout = $('#appAbout');
            containers.appAboutClose = containers.appAbout.find('.modal-btn-close');

            containers.output = $('.output');
            containers.outputResponse = containers.output.find('code');
            containers.outputTabulate = containers.output.find('.tabulate');

            containers.ctrlPanel = $('form#ctrlPanel');
            containers.filterStr = $('input#filterStr');
            containers.fmtRaw = $('input#fmtRaw');
            containers.fmtTable = $('input#fmtTable');
            containers.fileRef = $('input#fileRef');

            containers.fileRef.on('change', controls.handleFileSelect);
            containers.fmtRaw.on('click', controls.handleOutputFormat);
            containers.fmtTable.on('click', controls.handleOutputFormat);
            containers.ctrlPanel.on('reset', controls.resetAtDefaultState);

            containers.appLogo.on('click', controls.showAbout);
            containers.appAboutClose.on('click', controls.hideAbout);
        }
    }

    var app = new Card();
    app.initialize();
};

$(nistush);