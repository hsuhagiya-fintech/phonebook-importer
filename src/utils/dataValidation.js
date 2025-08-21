class SimpleEventEmitter {
    constructor(maxHandlers = 10) {
        this.map = new Map();
        this.maxHandlers = maxHandlers;
    }
    
    on(evt, handler) {
        const list = this.map.get(evt) || [];
        if (list.length >= this.maxHandlers) {
            console.warn(`Warning: Attempting to add a new handler for '${evt}' exceeding the limit of ${this.maxHandlers}.`);
            return;  // Prevent adding the new handler
        }
        list.push(handler);
        this.map.set(evt, list);
        return () => this.off(evt, handler);
    }
    
    off(evt, handler) {
        const list = this.map.get(evt) || [];
        const i = list.indexOf(handler);
        if (i >= 0) list.splice(i, 1);
        if (list.length === 0) {
            this.map.delete(evt);  // Remove empty lists
        }
    }

    emit(evt, ...args) {
        const list = this.map.get(evt) || [];
        for (const fn of list) {
            try { 
                fn(...args); 
            } catch (error) {
                console.error(`Error in event handler for event '${evt}':`, error);
            }
        }
    }
}
emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) {
        try {
            fn(...args);
        } catch (error) {
            console.error(`Error in event handler for event '${evt}':`, error);
        }
    }
}
