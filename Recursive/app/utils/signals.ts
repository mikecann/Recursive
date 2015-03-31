class Signal0 {

    handlers: { (): void; }[] = [];
    onceHandlers: { (): void; }[] = [];

    add(handler:()=>any) {
        this.handlers.push(handler);
    }

    addOnce(handler:()=>any) {
        this.onceHandlers.push(handler);
    }
    
    dispatch() {
        this.handlers.forEach(h=>h());
        this.onceHandlers.forEach(h=>h());
        this.onceHandlers = [];
    }

}

class Signal1 {

    handlers: { (param1:any): void; }[] = [];
    onceHandlers: { (param1:any): void; }[] = [];

    add(handler:(param1:any)=>any) {
        this.handlers.push(handler);
    }

    addOnce(handler:(param1:any)=>any) {
        this.onceHandlers.push(handler);
    }
    
    dispatch(param1:any) {
        this.handlers.forEach(h=>h(param1));
        this.onceHandlers.forEach(h=>h(param1));
        this.onceHandlers = [];
    }

}

class Signal2 {

    handlers: { (param1:any, param2:any): void; }[] = [];
    onceHandlers: { (param1:any, param2:any): void; }[] = [];

    add(handler:(param1:any, param2:any)=>any) {
        this.handlers.push(handler);
    }

    addOnce(handler:(param1:any)=>any) {
        this.onceHandlers.push(handler);
    }
    
    dispatch(param1:any, param2:any) {
        this.handlers.forEach(h=>h(param1,param2));
        this.onceHandlers.forEach(h=>h(param1,param2));
        this.onceHandlers = [];
    }

}