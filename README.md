# TMSDSE Backend Server
This program handles modification of graph data and force-directed graph rendering.

## HTTP API
All API endpoints respond with a JSON object containing an `"error"` boolean, which is true if the request encountered an error. In this case, a `"message"` string provides a description of the error and the request returns a non-200 HTTP status code. POST parameters (if required) may be provided in `urlencoded` or `json` format.

### Get graph data
`GET /data`  
Returns the latest rendered graph as a list of nodes and links.
```
fetch('https://example.com/data')
.then(res => res.json())
.then(data => doSomething(data));
```

### Add link
`POST /link/:source/:target`  
:source and :target are the Wikipedia IDs of the source and target nodes, respectively.
```
fetch(
    'https://example.com/link/Isaac_Asimov/Elon_Musk',
    {
        method: 'POST'
    }
)
.then(res => res.json())
.then(data => doSomething(data));
```

### Remove link
`DELETE /link/:source/:target`  
:source and :target are the Wikipedia IDs of the source and target nodes, respectively.
```
fetch(
    'https://example.com/link/Isaac_Asimov/Elon_Musk',
    {
        method: 'DELETE'
    }
)
.then(res => res.json())
.then(data => doSomething(data));
```

### Add/update node
`POST /node/:id`  
:id is the Wikipedia ID of the node to add/update.  
A `group` parameter (value 1, 2, or 3) indicating the type of node is required in the request body.

```
fetch(
    'https://example.com/node/L._Ron_Hubbard',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({group: 1})
    }
)
.then(res => res.json())
.then(data => doSomething(data));
```

### Remove node
`DELETE /node/:id`  
:id is the Wikipedia ID of the node to delete.
```
fetch(
    'https://example.com/node/L._Ron_Hubbard',
    {
        method: 'DELETE'
    }
)
.then(res => res.json())
.then(data => doSomething(data));
```