
## Conceitos de api
### Headers
______
````
° Como estou perguntando
  - Key "Accept", Value "application/json" 
° Como estou respondendo
  - key "Content-Type",  Value "application/json" 
````

### Lazy Loading Vs Eager Loading


### Status code
````
    Respostas de sucesso (200-299)
    Erros do cliente (400-499)
    Erros do servidor (500-599)
````
Conceitos Básicos
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
  - php artisan make:model Models/CastMember --all
  - php artisan make:model Models/Video --all
````
Criando Resource
______
````
  - php artisan make:resource CategoryResource
````
Criando Tables
______
````
  1° Pode ser utilizado com o "make:model Models/<Nome> --all"
    - php artisan make:migration create_categories_table
    - php artisan make:migration create_genres_table
    - php artisan make:migration create_cast_members_table
    - php artisan make:migration create_videos_table
  2° Relacionamentos entre tabelas
    - php artisan make:migration create_category_genre_table
    - php artisan make:migration create_genre_video_table
    - php artisan make:migration create_category_video_table    
````

Criando Rules
______
````
  - php artisan make:rule GenresHasCategoriesRule
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

Test
______
Media de teste 18 à 40 Megas
````
  Criando FEATURE
    ° Category
      - php artisan make:test Models/CategoryTest
      - php artisan make:test Http/Controllers/Api/CategoryControllerTest
    ° Genre
      - php artisan make:test Models/GenreTest
      - php artisan make:test Http/Controllers/Api/GenreControllerTest
    ° CastMember
      - php artisan make:test Models/CastMemberTest
      - php artisan make:test Http/Controllers/Api/CastMemberControllerTest
    ° Video
      - php artisan make:test Models/VideoTest
      - php artisan make:test Http/Controllers/Api/VideoControllerTest
  Criando UNIT
    - php artisan make:test Models/CategoryTest --unit
    - php artisan make:test Models/GenreTest --unit
    - php artisan make:test Rules/GenresHasCategoriesRuleUnitTest --unit
  Executando Teste
    - vendor/bin/phpunit
  Executando Teste em uma Única Class
    - vendor/bin/phpunit --filter CategoryTest
    - vendor/bin/phpunit --filter GenreTest
    - vendor/bin/phpunit --filter CastMember
  Executando Teste em uma Única Class/Metodo
    - vendor/bin/phpunit --filter CategoryTest::testExample
    - vendor/bin/phpunit --filter GenreTest::testExample
    - vendor/bin/phpunit --filter CastMember::testExample
    - vendor/bin/phpunit --filter Video::testExample
   Executando Teste em uma FEATURE Class
    - vendor/bin/phpunit --filter UploadedFilesUnitTest
    
```` 

# Iniciando com FrontEnd
#### Comando
  - npx create-react-app frontend --template typescript