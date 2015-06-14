define(['math'], function (math) {
    function foo() {
        return math.add(3,4);
    }

    return {
        foo: foo
    };
});