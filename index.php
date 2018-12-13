<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
require $_SERVER['DOCUMENT_ROOT'] . '/app/Models/Projects.php';
use App\Model\Projects;
use Slim\Views\PhpRenderer;

$dotenv = new \Dotenv\Dotenv($_SERVER['DOCUMENT_ROOT']);
$dotenv->load();

$configuration = [
  'settings' => [
      'displayErrorDetails' => (getenv('ENVIRONMENT') === 'development') ? true : false,
  ],
];
$c = new \Slim\Container($configuration);
$app = new \Slim\App($c);

$container = $app->getContainer();
$container['renderer'] = new PhpRenderer("./dist");

$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, "index.html", $args);
});

// API group
$app->group('/api', function () use ($app) {

  $app->get('/projects', function ($request, $response, $args) {
    $p = new Projects();
    $projectResponse = $p->getProjects();
  
    $projectResults = json_decode($projectResponse->getBody());
    $projects = $projectResults;
    $minimunDue=null;
    $maximumDue=null;
  
    foreach($projects->data as $project) {
      $tasksResponse = $p->getTasksByProject($project);
      $tasks = json_decode($tasksResponse->getBody());
      $tasks_array = $tasks->data;

      $next_page = $tasks->next_page;

      while (!is_null($next_page)) {
        if (!is_null($tasks->next_page)) {
          $nextTasksResponse = $p->getProjectsNextPage($tasks->next_page->uri);
          $nextTasks = json_decode( $nextTasksResponse->getBody() );
  
          $tasks_array = array_merge($tasks_array, array_values($nextTasks->data));
          $next_page = $nextTasks->next_page;
        }
      }

      $tasks->next_page = $next_page;

      $tasks->data = $tasks_array;

      foreach($tasks->data as $key => $task) {
        if (property_exists($task, 'due_on') && !is_null($task->due_on)) {
          if (is_null($minimunDue)) {
            $minimunDue = $task->due_on;
          } else {
            if ($task->due_on < $minimunDue) {
              $minimunDue = $task->due_on;
            }
          }
    
          if (is_null($maximumDue)) {
            $maximumDue = $task->due_on;
          } else {
            if ($task->due_on > $maximumDue) {
              $maximumDue = $task->due_on;
            }
          }
        }
      }
  
      $project->tasks = $tasks;
    }
  
    $projects->minimumDue = $minimunDue;
    $projects->maximumDue = $maximumDue;
  
    return json_encode($projects);
  });

});

$app->get('/signin', function ($request, $response, $args) use ($app) {
  return $response->withRedirect('/');
});

$app->options('/{routes:.+}', function ($request, $response, $args) {
  return $response;
});

$app->add(function ($req, $res, $next) {
  $response = $next($req, $res);
  return $response
          ->withHeader('Access-Control-Allow-Origin', '*')
          ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
          ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->run();

function prentr($s) {
  echo '<pre>';
  var_dump($s);
  echo '</pre>';
}