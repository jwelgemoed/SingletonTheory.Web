/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT


	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children

	<div
		data-angular-treeview="true"
		data-tree-id="tree"
		data-tree-model="roleList"
		data-node-id="roleId"
		data-node-label="roleName"
		data-node-children="children" >
	</div>
*/

(function ( angular ) {
	'use strict';

	angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {
				//tree id
				var treeId = attrs.treeId;
			
				//tree model
				var treeModel = attrs.treeModel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node label
				var nodeLabel = attrs.nodeLabel || 'label';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';
				
				//add
				var add = attrs.treeAdd || 'add';
				
				//edit
				var edit = attrs.treeEdit || 'edit';
				
				//move
				var move = attrs.treeMove || 'move';
				
				// delete
				var remove = attrs.treeRemove || 'remove';

				var isAdd = true;
				var isMove = true;
				var isEdit = true;
				var isDelete = true;

				//tree template
				var template =
					'<ul>' +
						'<li data-ng-repeat="node in ' + treeModel + '">' +
							'<i class="icon-plus" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="icon-minus" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
							'<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">' +
							'{{node.' + nodeLabel + '}} ' +
							' <i class="icon-plus-sign" data-ng-click="' + treeId + '.selectNodeAdd(node)"></i>' +
							' <i class="icon-edit" data-ng-click="' + treeId + '.selectNodeEdit(node)"></i>' +
							' <i class="icon-move" data-ng-click="' + treeId + '.selectNodeMove(node)"></i>' +
							' <i class="icon-remove-sign" data-ng-click="' + treeId + '.selectNodeDelete(node)"></i>' +
							'</span>' +
							'<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
						'</li>' +
					'</ul>';


				//check tree id, tree model
				if( treeId && treeModel ) {

					//root node
					if( attrs.angularTreeview ) {
					
						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

							//remove highlight from previous node
							if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;
						};
						
						//if add click,
						scope[treeId].selectNodeAdd = scope[treeId].selectNodeAdd || function (selectedNode) {

							scope[add](selectedNode);
						};
						
						//if edit click,
						scope[treeId].selectNodeEdit = scope[treeId].selectNodeEdit || function (selectedNode) {
							scope[edit](selectedNode);
						};
						
						//if move click,
						scope[treeId].selectNodeMove = scope[treeId].selectNodeMove || function (selectedNode) {
							scope[move](selectedNode);
						};
						
						//if delete click,
						scope[treeId].selectNodeDelete = scope[treeId].selectNodeDelete || function (selectedNode) {
							scope[remove](selectedNode);
						};
					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		};
	}]);
})( angular );
