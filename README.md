
#### Conceitos de api
Headers
______
````
° Como estou peguntando
  - Key "Accept", Value "application/json" 
° Como estou respondendo
  - key "Content-Type",  Value "application/json" 
````

#### Criando models e controller Category
````
  - php artisan make:model Models/Category --all
```` 

#### Testando Models
````
  Iniciando TINKER
    - php artisan tinker
  Validando model criado pelas --seed
    - App\Models\Category::all()
````

#### Command
Rotas da aplicação 
______
````
  - php artisan route:list
````