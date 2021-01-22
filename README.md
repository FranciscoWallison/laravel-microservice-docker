
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

#### Command
Criando models, controller e factory
______
````
  - php artisan make:model Models/Category --all
  - php artisan make:model Models/Genre --all
````
Consultando Rotas da aplicação 
______
````
  - php artisan route:list
````
Consultando Models com Tinker
______
````
  Iniciando TINKER
    - php artisan tinker
  Validando model criado pelas --seed
    - App\Models\Category::all()
````
Consultando Models com Tinker
______
````
  Iniciando TINKER
    - php artisan tinker
  Validando model criado pelas --seed
    - App\Models\Category::all()
````

Test
______
````
  Criando FEATURE
    - php artisan make:test CategoryTest
  Criando UNIT
    - php artisan make:test CategoryTest --unit
  Executando Teste
    - vendor/bin/phpunit
  Executando Teste em uma Única Class
    - vendor/bin/phpunit --filter CategoryTest
  Executando Teste em uma Única Class/Metodo
    - vendor/bin/phpunit --filter CategoryTest::testExample
````