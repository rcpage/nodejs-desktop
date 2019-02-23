# bnsf-playbooks

```sh
node playbook task create "My task does something important" --when='{{ var == 1 }}' --become=yes --become_user=root --module=file --module_params="{a: 1, b: 2}" --vars='{a: 1,b: 2}' --tags='[one, two, three]' --register=somePath --notify='some event handler' --ignore_errors=yes
```
