var BinaryTree = require('../../node_modules/btree-js/src/index.js');
var Tree = BinaryTree.Tree;
var Node = BinaryTree.Node;

var tree = new Tree();
tree.insert(new Node({ key: 10, text: 'blah' }));  // becomes tree's root
tree.insert(new Node({ key: 15, text: 'plop' }));  // tree.root.right.key: 15

tree.print();

