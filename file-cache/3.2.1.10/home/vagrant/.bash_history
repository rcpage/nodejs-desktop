ls
cd desktop/
ls
cd www
pwd
exit
cd desktop/
sudo node HttpServerTest.js 
exit
mongo
exit
ls
cd desktop/
ls
cd System
ls -l
./Database.sh 
./Database.sh db
./Database.sh debug
db
./Database.sh db find
./Database.sh db records add {}
./Database.sh db records find {}
./Database.sh db documents transaction add {}
ls
mv Database.sh Database
mv Database.js Database
cd Database/
./Database.sh db documents transaction add "{ hello world: 123 }"
./Database.sh db documents transaction find
./Database.sh db documents transaction find ""
./Database.sh db documents transaction add "{ key: 100 }"
./Database.sh db documents transaction add "{ key: 10 }"
./Database.sh db documents transaction add "{ key: 0 }"
./Database.sh db documents transaction add "{ key: -100 }"
./Database.sh db documents transaction find '{ }'
./Database.sh db documents transaction find '{}'
./Database.sh db documents transaction find ""
./Database.sh db documents transaction find "{ document: { AND:{ key:{'==':10} }}}"
./Database.sh db documents transaction find "{ document: { AND:{ key:{'>=':10} }}}"
./Database.sh db documents transaction find "{ document: { AND:{ key:{'<=':0} }}}"
./Database.sh db documents transaction find "{ document: { AND:{ key:{'<=':0}, key:{'==':-100} }}}"
./Database.sh db documents transaction find "{ document: { AND:{ key:{'<=':0}, lkey:{'==':-100} }}}"
./Database.sh db documents transaction find "{ document: { AND:{ key:{'<=':0}, 
./Database.sh db documents transaction find "{ document: { AND:{ key:{'<=':0}, lkey:{'==':-100} }}}"
ls -l /usr/bin/stack
rm /usr/bin/stack
sudo rm /usr/bin/stack
pwd
ln -s /usr/bin/stack /home/vagrant/desktop/System/Database/Database.sh
ln -s /home/vagrant/desktop/System/Database/Database.sh /usr/bin/stack
sudo ln -s /home/vagrant/desktop/System/Database/Database.sh /usr/bin/stack
./Database.sh db documents transaction find "{ document: { AND:{ key:{'<=':0}, lkey:{'==':-100} }}}"
stack db documents transaction find "{ document: { AND:{ key:{'<=':0}, lkey:{'==':-100} }}}"
stack db documents transaction find "{ document: { AND:{ key:{'<=':0} }}}"
stack db documents transaction add '{ name: Rusty Page, age: 32 }'
rm -rf ./storage/documents/transaction/
stack db documents transaction add '{ name: Rusty Page, age: 32 }'
stack db documents transaction add '{ name: Mike Jones, age: 52 }'
stack db documents transaction add '{ name: Rusty Page, age: 32 }'
stack db documents transaction add '{ name: Mike Jones, age: 52 }'
stack db documents transaction find '{ document: AND:{ name: Mike Jones, age: 52 }}}'
stack db documents transaction find '{ document: { AND:{ name: Mike Jones, age: 52 }}}}'
stack db documents transaction find '{ document: { AND:{  age: 52 }}}}'
stack db documents transaction find '{ document: { AND:{  age: 52 }}}'
stack db documents transaction find '{ document: { AND:{  age: {'==':52} }}}'
stack db documents transaction find '{ document: { AND:{  age: {'==': 52} }}}'
stack db documents transaction find '{ document: { AND:{  age: {'<=': 52} }}}'
stack db documents transaction find '{ document: { AND:{  age: {'==': 52} }}}'
stack db documents transaction find '{ document: { AND:{  age: {'<': 52} }}}'
stack db documents transaction find '{ document: { AND:{  age: {'<': 52 }}}}'
stack db documents transaction find '{ document: { AND:{  age: {"<": 52 }}}}'
stack db documents transaction find '{ document: { AND:{  age: {"<=": 52 }}}}'
stack db documents transaction find ' { AND:{  age: {"<=": 52 }}}'
stack db documents transaction find '{AND:{age:{"<=":52}}}'
stack db documents transaction find '{$and:{age:{"<=":52}}}'
stack db documents transaction find '{$and:{age:{"<":52}}}'
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$set:{ address: 123 Street}}'
stack db documents transaction update '{$and:{age:{"<":52}}}' '{$set:{ address: 123 Street}}'
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$set:{ address: 123 Street}}'
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$del:{ address: 123 Street}}'
stack db documents transaction update '{$and:{age:{"<":52}}}' '{$del:{ address: 123 Street}}'
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$del:{ address: 123 Street}}'
stack db documents transaction update '{$and:{age:{"<":52}}}' '{$set:{ address: 123 Street}}'
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$del:{ address: 123 Street}}'
ls
rm storage/ -fr
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$del:{ address: 123 Street}}'
stack db documents transaction add '{ name: Mike Jones, age: 52 }'
stack db documents transaction add '{ name: Rusty Page, age: 32 }'
stack db documents transaction add '{ name: Bob Villa, age: 100 }'
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$del:{ address: 123 Street}}'
stack db documents transaction update '{$and:{age:{"<":52}}}' '{$set:{ address: 123 Street}}'
stack db documents transaction find '{$and:{age:{"<":52}}}' '{$del:{ address: 123 Street}}'
node
cd ..
node
npm install btree-js
ls
node
npm install btree-js
node
npm install underscore
node
cd System
cd Database/
node btree.js 
cd ..
node db
node db dasdf asdf asd f 
npm install commander
node db
npm install string-argv
node
node db
node db 1 2 3 4
node db
System/Database/dbcmd.js
node System/Database/dbcmd.js
node System/Database/dbcmd.js find.documents.transaction ""
cd System/Database/
node dbcmd.js 
node dbcmd.js find.documents.transaction
node dbcmd.js find.documents.transaction ""
stack find.documents.transaction ""
stack find.documents.transaction
stack find.documents.transaction "{$and:{age:{'==':32}}}"
stack find.documents.transaction "{$and:{age:{'>':0}}}"
stack find.documents.transaction "{$and:{age:{ '>': 0}}}"
stack find.documents.transaction "{ $and:{ age: { '>': 0}}}"
stack find.documents.transaction "{ '$and':{ age: { '>': 0}}}"
stack find.documents.transaction '{ $and:{ age: { ">": 0}}}'
stack find.documents.transaction {$and:{age:{">":0}}}
stack find.documents.transaction '{$and:{age:{">":0}}}'
stack find.documents.transaction '{$and:{age:{>:0}}}'
stack find.documents.transaction '{$and:{age:{">":0}}}'
stack find.documents.transaction '{$and:{age:{"==":0}}}'
stack find.documents.transaction '{$and:{age:{"==":32}}}'
stack update.documents.transaction '{$and:{age:{"==":32}}}' '{$set:{zip:78660}}'
stack find.documents.transaction '{$and:{age:{"==":32}}}'
stack update.documents.transaction '{$and:{age:{"==":32}}}' '{$del:{zip:78660}}'
stack find.documents.transaction '{$and:{age:{"==":32}}}'
stack update.documents.transaction '{$and:{age:{"==":32}}}' '{$set:{zip: 78660}}'
stack find.documents.transaction '{$and:{age:{"==":32}}}'
stack update.documents.transaction '{$and:{age:{"==":32}}}' '{$set:{zip: 78660}}'
stack update.documents.transaction '{$and:{age:{"==":32}}}' '{$set:{zip: 78660-12345}}'
stack update.documents.transaction.pretty '{$and:{age:{"==":32}}}' '{$set:{zip: 78660-12345}}'
stack find.documents.transaction.pretty '{$and:{age:{"<=":32}}}' '{$set:{zip: 78660-12345}}'
stack add.documents.transaction "{ age: 21, name: Bob Young }"
stack add.documents.transaction '{ age: 21, name: Bob Young }'
stack add.documents.transaction '{ age: 90, name: Bob Old }'
stack find.documents.transaction
stack find.documents.transaction.pretty
stack add.documents.transaction '{ age: 2, name: Bob Baby }'
stack add.documents.transaction '{ age: 2, name: Bob Teen }'
stack find.documents.transaction '{ age: 2, name: Bob Teen }'
stack find.documents.transaction '{$and:{ age: 2, name: Bob Teen }}'
stack update.documents.transaction '{$and:{ age: 2, name: Bob Teen }}' '{$set:{age: 15}}'
stack find.documents.transaction '{$and:{ age: 2, name: Bob Teen }}'
stack -h
stack -V
node dbshell.js 
exit
sudo su
ll
cd desktop
node HttpServerTest.js 
sudo su
cd desktop
sudo su
cd desktop
sudo su
exit
