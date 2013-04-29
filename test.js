function assert (condition) {
    "use strict";
    if (eval(condition)) {
        console.log(condition + ' [OK]');
    } else {
        console.log(condition + ' [FAILED]');
    }
}