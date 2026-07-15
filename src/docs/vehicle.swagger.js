/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Lista veículos com filtros e ordenação
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - available
 *             - sold
 *         description: Filtra os veículos por status
 *         example: available
 *
 *       - in: query
 *         name: sortField
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - price
 *             - year
 *         description: Campo utilizado para ordenação
 *         example: price
 *
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Direção da ordenação
 *         example: asc
 *
 *     responses:
 *       200:
 *         description: Lista de veículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1f5a2b64-772e-4f60-89f7-947b87f1ab16"
 *                   brand:
 *                     type: string
 *                     example: Toyota
 *                   model:
 *                     type: string
 *                     example: Corolla
 *                   price:
 *                     type: number
 *                     example: 85000
 *                   status:
 *                     type: string
 *                     example: AVAILABLE
 *   post:
 *     summary: Criar um novo veículo
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - year
 *               - color
 *               - price   
 *             properties:
 *               brand:
 *                 type: string
 *                 example: "Ford"
 *               model:
 *                 type: string
 *                 example: "Ká"
 *               year:
 *                 type: integer
 *                 example: 2019
 *               color:
 *                 type: string
 *                 example: azul
 *               price:
 *                 type: integer
 *                 example: 60000
 *     responses:
 *       201:
 *         description: Criado com sucesso 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 model:
 *                   type: string
 *                 year:
 *                   type: integer
 *                   example: 2019
 *                 color:
 *                   type: string
 *                 price:
 *                   type: string
 *                 status:
 *                   type: string
 * 
 * /vehicles/{id}:
 *   get:
 *     summary: Buscar veículo por ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         example: "33695d2d-8c9b-4ccb-8b86-1a1d79238l5b"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Veículo encontrado
 *         content: 
 *            application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "33695d2d-8c9b-4ccb-8b86-1a1d79238l5b"
 *                 brand:
 *                   type: string
 *                   example: Fiat
 *                 model:
 *                   type: string
 *                   example: Argo
 *                 price:
 *                   type: string
 *                   example: 80000
 *                 status:
 *                   type: string
 *                   example: AVAILABLE
 *       404: 
 *          description: Veículo não encontrado
 * 
 *   put:
 *     summary: Atualizar veículos
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         example: "33695d2d-8c9b-4ccb-8b86-1a1d79238l5b"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                 - brand
 *                 - model
 *                 - year
 *                 - color
 *                 - price
 *             properties:
 *               brand:
 *                 type: string
 *                 example: "Ford"
 *               model:
 *                 type: string
 *                 example: "Ká"
 *               year:
 *                 type: interger
 *                 example: 2023
 *               color:
 *                 type: string
 *                 example: "Vermelho"
 *               price:
 *                 type: number
 *                 format: float 
 *                 example: 80000.86
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 *         content: 
 *            application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "33695d2d-8c9b-4ccb-8b86-1a1d79238l5b"
 *                 brand:
 *                   type: string
 *                   example: Fiat
 *                 model:
 *                   type: string
 *                   example: Argo
 *                 price:
 *                   type: number
 *                   example: 80000
 *                 status:
 *                   type: string
 *                   example: AVAILABLE
 *       400:
 *         description: Erro ao atualizar o veículo
 *       422:
 *         description: Operação não permitida
 * 
 *   delete:
 *     summary: Deletar veículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         example: "33695d2d-8c9b-4ccb-8b86-1a1d79238l5b"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deletado com sucesso
 *       400:
 *         description: Erro ao deletar o veículo
 *       404:
 *         description: Veículo não encontrado
 * 
 * /vehicles/{id}/status:
 *   patch:
 *     summary: Atualizar o status do veículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         example: "33695d2d-8c9b-4ccb-8b86-1a1d79238l5b"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - status
 *             properties:
 *                status:
 *                  type: string
 *                  enum: [AVAILABLE, PENDING_PAYMENT, SOLD]  
 * 
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar o status 
 * 
 * 
 */
 
export {}


