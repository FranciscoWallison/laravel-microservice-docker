
## Conceitos de api
#### Headers
______
````
° Como estou peguntando
  - Key "Accept", Value "application/json" 
° Como estou respondendo
  - key "Content-Type",  Value "application/json" 
````
#### Status code
______
````
  ° Status code com o valor ~200 é semântico para o sucesso.
    - 204, valor vazio muito utilizado para DELETE.
````
#### Substituindo ID Por UUID

______
````
  ° Dificulta para o cliente saber a quantidade de registros feitos
````

#### Route Model Binding


## Laravel
#### Criando models e controller Category
````
  - php artisan make:model Models/Category --all
```` 
#### Criando models e controller Genre
````
  - php artisan make:model Models/Genre --all
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