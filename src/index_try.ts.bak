const data = `
[{ "obj_type": "folder", "obj_id": 135108, "title": "cur_trade", "parent_obj_id": 135107 },
{ "obj_type": "folder", "obj_id": 135877, "title": "notification_120", "parent_obj_id": 135107 },
{ "obj_type": "folder", "obj_id": 135878, "title": "temp", "parent_obj_id": 135108 },
{
    "obj_type": "conv", "obj_id": 232968, "title": "Config_one", "parent_obj_id": 135108,
    "body": {
        "request_proc": "ok", "ops": [{
            "id": "", "obj": "obj_scheme", "proc": "ok", "scheme":
                [{
                    "obj_type": 1, "obj_id": 232968, "parent_id": 0, "title": "Config_one",
                    "description": "", "status": "actived", "params": null, "conv_type": "state",
                    "scheme": {
                        "nodes": [{
                            "id": "5927453760e3270996220548", "obj_type": 1,
                            "condition": {
                                "logics": [{ "type": "go", "to_node_id": "5927453760e327099622054b" }],
                                "semaphors": []
                            }, "title": "Start", "description": "", "x": 880, "y": 100, "extra": "{\"modeForm\":\"collapse\",\"icon\":\"\"}"
                        },
                        {
                            "id": "5927453760e327099622054b", "obj_type": 0, "condition": {
                                "logics": [{ "type": "api_callback" },
                                { "type": "go", "to_node_id": "5927453760e327099622054b" }],
                                "semaphors": [{ "type": "time", "value": 86400,
                                 "dimension": "sec", "to_node_id": "5927453760e3270996220549" }]
                            },
                            "title": "Active users", "description": "", "x": 740, "y": 400,
                            "extra": "{\"modeForm\":\"expand\",\"icon\":\"state\"}"},
                            {"id":"5927453760e3270996220549","obj_type":0,
                            "condition":{"logics":[{"type":"api_callback"},
                            {"type":"go","to_node_id":"5927453760e3270996220549"}],"semaphors":[]},
                            "title":"Inactive users","description":"","x":1108,"y":400,
                            "extra":"{\"modeForm\":\"expand\",\"icon\":\"state\"}"}], "web_settings": [[], []]
                    }, "company_id": null
                }]
        }]
    }
}]`;


class Node {
    constuctor(id) {
        this.id = id;
        this.afters = [];
    }
}

function tsort(edges: Array<Array<any>>) {
    const nodes = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
        sorted: any[] = [], // sorted list of IDs ( returned value )
        visited = {}; // hash: id of already visited node => true



    // 1. build data structures
    edges.forEach(function (v) {
        var from = v[0], to = v[1];
        if (!nodes[from]) nodes[from] = new Node(from);
        if (!nodes[to]) nodes[to] = new Node(to);
        nodes[from].afters.push(to);
    });

    // 2. topological sort
    Object.keys(nodes).forEach(function visit(idstr, ancestors) {
        var node = nodes[idstr],
            id = node.id;

        // if already exists, do nothing
        if (visited[idstr]) return;

        if (!Array.isArray(ancestors)) ancestors = [];

        ancestors.push(id);

        visited[idstr] = true;

        node.afters.forEach(function (afterID) {
            if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
                throw new Error('closed chain : ' + afterID + ' is in ' + id);

            visit(afterID.toString(), ancestors.map(function (v) { return v })); // recursive call
        });

        sorted.unshift(id);
    });

    return sorted;
}