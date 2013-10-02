app.directive('codeBlock', [ 'ui.config', function (uiConfig){
	var modes = {
		javascript : {
			template :'<script>{contents|s}</script>'
		},
		css : {
			template :'<style type="text/css">{contents|s}</style>'
		},
		plaintext : {
			template :'<p>{contents|s}</p>'
		}
	};
	
	var buildAndSendInsertHtml = function(scope, codeMirrorData){
		var modeData = modes[codeMirrorData.mode];	
		var modeType = codeMirrorData.mode;
		switch(modeType){
			case 'javascript':
				var re = /<script(.|\n)*>(.|\n)*?<\/script>/;
				var match = re.exec(codeMirrorData.contents);
				if(match){
					scope.sendRequest( 'codeBlock_insert', {html:codeMirrorData.contents});	
				}
				else {
					dust.loadSource(dust.compile(modeData.template, 'codeBlock_changes'));
					dust.render('codeBlock_changes', codeMirrorData, function(err, out) {
						if( out ){
							scope.sendRequest( 'codeBlock_insert', {html:out} );
						}
						if( err ){
							debug.error('dust error, rendering form:',err.message);
						}
					});	
				}
				break;
				
			case 'htmlmixed':
				scope.sendRequest( 'codeBlock_insert', {html:codeMirrorData.contents});
				break;
				
			case 'css':
				var re = /<style(.|\n)*>(.|\n)*?<\/style>/;
				console.log("Match", match, re);
				var match = re.exec(codeMirrorData.contents);
				if(match){
					scope.sendRequest( 'codeBlock_insert', {html:codeMirrorData.contents});	
				}
				else {
					dust.loadSource(dust.compile(modeData.template, 'codeBlock_changes'));
					dust.render('codeBlock_changes', codeMirrorData, function(err, out) {
						if( out ){
							scope.sendRequest( 'codeBlock_insert', {html:out} );
						}
						if( err ){
							debug.error('dust error, rendering form:',err.message);
						}
					});	
				}
				break;
				
			case 'plaintext':
				dust.loadSource(dust.compile(modeData.template, 'codeBlock_changes'));
				dust.render('codeBlock_changes', codeMirrorData, function(err, out) {
					if( out ){
						scope.sendRequest( 'codeBlock_insert', {html:out} );
					}
					if( err ){
						debug.error('dust error, rendering form:',err.message);
					}
				});
				break;
		}
	};		

	return {
		restrict: 'E',
		scope: false,
		replace: true,
		templateUrl: 'partials/codeBlock.html',
		link: function(scope, element, attrs) {

			uiConfig = uiConfig || {};
			uiConfig.codemirror = uiConfig.codemirror || {};
			scope.codeBlock = {
				codemirror : {
					mode : 'htmlmixed', //'javascript',
					lineNumbers: true,
					contents : ''
				},
				
				set : function(opts){					
					angular.extend(scope.codeBlock.codemirror, opts);
					angular.extend( uiConfig.codemirror, scope.codeBlock.codemirror);
				},
				
				open : function(opts){
					angular.extend(scope.codeBlock.codemirror, opts);
					angular.extend( uiConfig.codemirror, scope.codeBlock.codemirror);					
					jQuery("#modal_codeBlockEditor").modal();					

				}
			};
		
			scope.$on('editCodeBlock', function(event, templateData){
				scope.codeBlock.open({mode : 'htmlmixed', lineNumbers: true});
			});
			
			element.find('.btn-insert').bind('click', function(event){
				buildAndSendInsertHtml( scope, scope.codeBlock.codemirror);
				console.log( 'codeBlock Insert', arguments, scope.codeBlock.codemirror.contents);
			});
		}
	};
}]);
