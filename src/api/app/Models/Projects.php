<?php namespace App\Model;
use GuzzleHttp\Client;
$dotenv = new \Dotenv\Dotenv($_SERVER['DOCUMENT_ROOT'] . '/api');
$dotenv->load();

class Projects {
  protected $asana_api_key;
  protected $team_id;
  protected $client;

  public function __construct($testing = false) {
    $this->asana_api_key = getenv('ASANA_API_KEY');
    $this->team_id = getenv('TEAM_ID');
    $this->client = new Client([
      'headers' => [
        'Accept' => 'application/json',
        'Authorization' => "Bearer {$this->asana_api_key}",
        'Content-Type' => 'application/json'
      ],
      'base_uri' => 'https://app.asana.com/api/1.0/'
    ]);    
  }

  public function getProjects() {
    $response = $this->client->request('GET', 'teams/' . $this->team_id . '/projects?opt_expand=owner&limit=100&archived=false');
    return $response;
  }

  public function getTasksByProject($project) {
    $response = $this->client->request('GET', 'projects/' . $project->id . '/tasks?opt_expand=completed,name,due_on,due_at&limit=100');
    return $response;
  }
}