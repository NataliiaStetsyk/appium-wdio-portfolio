Feature: Mobile application login
  As a mobile user
  I want to authenticate successfully
  So that I can access the product catalog

  Scenario: Successful login with valid credentials
    Given the mobile app is open
    When the user logs in as "standardUser"
    Then the product catalog is displayed
