<?php
require $_SERVER['DOCUMENT_ROOT'] . '/api/vendor/autoload.php';
use App\Model\Projects;

$dotenv = new \Dotenv\Dotenv($_SERVER['DOCUMENT_ROOT'] . '/api');
$dotenv->load();

//$app = new Slim\App();
$configuration = [
  'settings' => [
      'displayErrorDetails' => true,
  ],
];
$c = new \Slim\Container($configuration);
$app = new \Slim\App($c);

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

    foreach($tasks->data as $task) {
      if (property_exists($task, 'due_on') && !is_null($task->due_on)) {
        if (is_null($minimunDue)) {
          $minimunDue = $task->due_on;
        } else {
          if (($task->due_on < $minimunDue) && ($task->completed === false)) {
            $minimunDue = $task->due_on;

          }
        }
  
        if (is_null($maximumDue)) {
          $maximumDue = $task->due_on;
        } else {
          if (($task->due_on > $maximumDue) && ($task->completed === false)) {
            $maximumDue = $task->due_on;
          }
        }
      }
    }

    $project->tasks = $tasks;
  }

  $projects->minimumDue = $minimunDue;
  $projects->maximumDue = $maximumDue;

  echo json_encode($projects);
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