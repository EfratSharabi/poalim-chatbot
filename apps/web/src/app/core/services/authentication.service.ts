import { Injectable } from '@angular/core';

@Injectable({ 
    providedIn: 'root' 
})
export class AuthenticationService {

    private readonly users = ['Sara', 'John', 'Alice', 'Bob', 'Eve', 'Charlie', 'David', 'Faythe', 'Grace', 'Heidi'];

    readonly currentUserId = this.randomUserId();

    private randomUserId(): string {
        const idx = Math.floor(Math.random() * this.users.length);
        const user = this.users[idx];
        console.log(user);
        return user;
    }
}
