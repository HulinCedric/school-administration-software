# Version 1.4.0
- Enlever l’heure des timestamps de la base de données lors d'extraction Excel.
    - @see : DBRequest.class.php
- Sélectionner seulement les élèves à radier et non l'inverse.
    - @see : eleveRadier.html
    - @see : eleveRadierCheckbox.js
- Correction orthographique pour l'affectation.
    - @see : classeAffecterCheckbox.js
- Mise en place de la déradiation
    - @see : index.html
    - @see : enfantCheckRequest.js
    - @add : eleveDeradier.html
    - @add : eleveDeradierCheckbox.js
- Mise en place de la désaffectation
    - @see : index.html
    - @add : classeDesaffecter.html
    - @add : classeDesaffecterCheckbox.js

# Version 1.3.0
- Modification de la fonction niveauChanged pour intégrer certaines règles<sup>*</sup>
    - @see : eleveEnregistrer.js
- Modification de la fonction niveauChanged pour intégrer certaines règles<sup>*</sup>
    - @see : enfantEnregistrer.js
- Fix bug de filtre année scolaire.
    - @see : responsableLister.js
- <sup>*</sup>
    - Sieste à renseigner que pour la petite section.
    - Langue vivante 2 que pour la 3e et 4e.

# Version 1.2.0
- Modification de la rubrique modifier élève HTML, ajout du champ Niveau.
- Modification de la rubrique enregistrer élève JS, Update Niveau et mise a null des infos de scolarité + delete participation classe verte.

# Version 1.1.0
- Ajout de la rubrique commission, permettant les checks sur les enfants.- Ajout de la rubrique confirmation, permettant les checks sur les enfants.
- Modification de la restriction obligeant l'information enseignant dans l'enregistrement de classe.
- Modification dans la proposition des niveau supérieur de classe

# Version 1.0.0
- Livrable du stage